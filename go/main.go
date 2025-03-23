package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
    "go/parser"
    "go/token"
    "go/ast"
    "bytes"
    "regexp"
    "strings"
    "github.com/gin-gonic/gin"
)

func cleanup_quoted(original string, quote string) string {
    value := regexp.MustCompile(`(?m)Value: "` + quote + "(.*?)" + quote + `"`)
    result := value.ReplaceAllStringFunc(original, func(match string) string {
        start := len("Value: ") + 1
        end := len(match) - 1
        withoutValuePrefix := match[start:end]
        contentNoQuotes := strings.ReplaceAll(withoutValuePrefix, `"`, "")
        contentNoBackslash := strings.ReplaceAll(contentNoQuotes, "\\", "")
        contentNoBackticks := strings.ReplaceAll(contentNoBackslash, "`", "")
        return fmt.Sprintf("Value: \"%s\"", contentNoBackticks)
    })
    return result
}

func cleanup_phase_1(original string) string {
    return cleanup_quoted(original, "`")
}

func cleanup_phase_0(original string) string {
    return cleanup_quoted(original, `\\\"`)
}

func cleanup(treeRaw string) string {

    tree := cleanup_phase_1(cleanup_phase_0(treeRaw))
    removeLineNumbers := regexp.MustCompile(`(?m)^\s*\d+  `)
    treeWithoutLineNumbers := removeLineNumbers.ReplaceAllString(tree, "")
    removeIndentingDots := regexp.MustCompile(`(?m)^(\.  )*`)
    return removeIndentingDots.ReplaceAllStringFunc(treeWithoutLineNumbers, func(match string) string {
        numDots := strings.Count(match, ".  ")
        return strings.Repeat("    ", numDots)
    })
}

func toNativeGolangAst(c *gin.Context) {

    file, _, err := c.Request.FormFile("source")
    if err != nil {
        c.String(http.StatusBadRequest, "no file was sent")
        return
    }
    defer file.Close()

    content, err := ioutil.ReadAll(file)
    if err != nil {
        c.String(http.StatusInternalServerError, "failed to read file content")
        return
    }

    fset := token.NewFileSet()
    tree, err := parser.ParseFile(fset, "example.go", content, parser.AllErrors)
    if err != nil {
        c.String(http.StatusInternalServerError, "failed to parse golang file")
        return
    }

    var buf bytes.Buffer
    ast.Fprint(&buf, fset, tree, nil)
    result := buf.String()

    c.String(http.StatusOK, cleanup(result))
}

func main() {

    r := gin.Default()
    r.POST("/to/native/go/ast", toNativeGolangAst)
    r.Run(":8080")
}