package com.example.javaast;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.tools.*;
import java.io.IOException;
import java.net.URI;
import java.util.List;

import com.sun.source.tree.*;
import com.sun.source.util.*;

@RestController
public class JavaAstController {

    @PostMapping("/to/native/java/ast")
    public String parseJavaFile(@RequestParam("source") MultipartFile file) throws IOException {
        if (file.isEmpty()) return "No file uploaded.";

        String code = new String(file.getBytes());

        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        JavaFileObject javaFile = new SimpleJavaFileObject(URI.create("string:///" + file.getOriginalFilename()), JavaFileObject.Kind.SOURCE) {
            @Override
            public CharSequence getCharContent(boolean ignoreEncodingErrors) {
                return code;
            }
        };

        JavacTask task = (JavacTask) compiler.getTask(null, null, null, null, null, List.of(javaFile));
        Iterable<? extends CompilationUnitTree> trees = task.parse();

        StringBuilder out = new StringBuilder();
        Trees treesUtil = Trees.instance(task);

        for (CompilationUnitTree tree : trees) {
            final String fileName = file.getOriginalFilename();
            final LineMap lineMap = tree.getLineMap();

            tree.accept(new TreeScanner<Void, Integer>() {
                private String indent(int level) {
                    return "    ".repeat(level);
                }

                private String formatLocation(Tree node) {
                    long pos = treesUtil.getSourcePositions().getStartPosition(tree, node);
                    if (pos == Diagnostic.NOPOS || lineMap == null) {
                        return "";
                    }
                    long line = lineMap.getLineNumber(pos);
                    long column = lineMap.getColumnNumber(pos);
                    return String.format(" (%s:%d:%d)", fileName, line, column);
                }

                @Override
                public Void visitClass(ClassTree node, Integer level) {
                    out.append(indent(level))
                       .append("Class: ").append(node.getSimpleName())
                       .append(formatLocation(node)).append("\n");
                    return super.visitClass(node, level + 1);
                }

                @Override
                public Void visitMethod(MethodTree node, Integer level) {
                    out.append(indent(level))
                       .append("Method: ").append(node.getName())
                       .append(formatLocation(node)).append("\n");
                    return super.visitMethod(node, level + 1);
                }

                @Override
                public Void visitVariable(VariableTree node, Integer level) {
                    out.append(indent(level))
                       .append("Variable: ").append(node.getName())
                       .append(formatLocation(node)).append("\n");
                    return super.visitVariable(node, level + 1);
                }

                @Override
                public Void scan(Tree node, Integer level) {
                    return super.scan(node, level == null ? 0 : level);
                }
            }, 0);
        }

        return out.toString();
    }
}
