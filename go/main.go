package main

import (
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

func cleanup(treeRaw string) string {

    value := regexp.MustCompile(`(?m)Value: "\\\"(.*)\\\""$`)
    tree := value.ReplaceAllString(treeRaw, `Value: "$1"`)
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