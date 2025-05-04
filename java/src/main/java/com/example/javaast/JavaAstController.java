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
                    out.append(indent(level)).append("Class: ").append(node.getSimpleName()).append(formatLocation(node)).append("\n");
                    return super.visitClass(node, level + 1);
                }

                @Override
                public Void visitMethod(MethodTree node, Integer level) {
                    out.append(indent(level)).append("Method: ").append(node.getName()).append(formatLocation(node)).append("\n");
                    return super.visitMethod(node, level + 1);
                }

                @Override
                public Void visitVariable(VariableTree node, Integer level) {
                    out.append(indent(level)).append("Variable: ").append(node.getName()).append(formatLocation(node)).append("\n");
                    return super.visitVariable(node, level + 1);
                }

                @Override
                public Void visitIf(IfTree node, Integer level) {
                    out.append(indent(level)).append("If Statement").append(formatLocation(node)).append("\n");
                    return super.visitIf(node, level + 1);
                }

                @Override
                public Void visitWhileLoop(WhileLoopTree node, Integer level) {
                    out.append(indent(level)).append("While Loop").append(formatLocation(node)).append("\n");
                    return super.visitWhileLoop(node, level + 1);
                }

                @Override
                public Void visitBreak(BreakTree node, Integer level) {
                    out.append(indent(level)).append("Break Statement").append(formatLocation(node)).append("\n");
                    return super.visitBreak(node, level);
                }

                @Override
                public Void visitContinue(ContinueTree node, Integer level) {
                    out.append(indent(level)).append("Continue Statement").append(formatLocation(node)).append("\n");
                    return super.visitContinue(node, level);
                }

                @Override
                public Void visitReturn(ReturnTree node, Integer level) {
                    out.append(indent(level)).append("Return Statement").append(formatLocation(node)).append("\n");
                    return super.visitReturn(node, level);
                }

                @Override
                public Void visitTry(TryTree node, Integer level) {
                    out.append(indent(level)).append("Try Block").append(formatLocation(node)).append("\n");
                    return super.visitTry(node, level + 1);
                }

                
                @Override
                public Void visitSwitch(SwitchTree node, Integer level) {
                    out.append(indent(level)).append("Switch Statement").append(formatLocation(node)).append("\n");
                    return super.visitSwitch(node, level + 1);
                }

                @Override
                public Void visitCase(CaseTree node, Integer level) {
                    out.append(indent(level)).append("Case Statement").append(formatLocation(node)).append("\n");
                    return super.visitCase(node, level + 1);
                }

                @Override
                public Void visitForLoop(ForLoopTree node, Integer level) {
                    out.append(indent(level)).append("For Loop").append(formatLocation(node)).append("\n");
                    return super.visitForLoop(node, level + 1);
                }

                @Override
                public Void visitEnhancedForLoop(EnhancedForLoopTree node, Integer level) {
                    out.append(indent(level)).append("Enhanced For Loop").append(formatLocation(node)).append("\n");
                    return super.visitEnhancedForLoop(node, level + 1);
                }

                @Override
                public Void visitThrow(ThrowTree node, Integer level) {
                    out.append(indent(level)).append("Throw Statement").append(formatLocation(node)).append("\n");
                    return super.visitThrow(node, level + 1);
                }

                @Override
                public Void visitAssert(AssertTree node, Integer level) {
                    out.append(indent(level)).append("Assert Statement").append(formatLocation(node)).append("\n");
                    return super.visitAssert(node, level + 1);
                }

                @Override
                public Void visitInstanceOf(InstanceOfTree node, Integer level) {
                    out.append(indent(level)).append("Instanceof Check").append(formatLocation(node)).append("\n");
                    return super.visitInstanceOf(node, level + 1);
                }

                @Override
                public Void visitTypeCast(TypeCastTree node, Integer level) {
                    out.append(indent(level)).append("Type Cast").append(formatLocation(node)).append("\n");
                    return super.visitTypeCast(node, level + 1);
                }

                @Override
                public Void visitAnnotation(AnnotationTree node, Integer level) {
                    out.append(indent(level)).append("Annotation: ").append(node.getAnnotationType()).append(formatLocation(node)).append("\n");
                    return super.visitAnnotation(node, level + 1);
                }
                
                @Override
                public Void visitImport(ImportTree node, Integer level) {
                    out.append(indent(level)).append("Import: ")
                       .append(node.getQualifiedIdentifier().toString())
                       .append(formatLocation(node)).append("\n");
                    return super.visitImport(node, level);
                }
            
                @Override
                public Void visitLambdaExpression(LambdaExpressionTree node, Integer level) {
                    out.append(indent(level)).append("Lambda Expression")
                       .append(formatLocation(node)).append("\n");
                    return super.visitLambdaExpression(node, level + 1);
                }
            
                @Override
                public Void visitTypeParameter(TypeParameterTree node, Integer level) {
                    out.append(indent(level)).append("Type Parameter: ").append(node.getName()).append(formatLocation(node)).append("\n");
                    return super.visitTypeParameter(node, level + 1);
                }
                 
                @Override
                public Void visitBinary(BinaryTree node, Integer level) {
                    out.append(indent(level)).append("Binary Expression: ").append(node.getKind().toString()).append(formatLocation(node)).append("\n");
                    return super.visitBinary(node, level + 1);
                }

                @Override
                public Void visitUnary(UnaryTree node, Integer level) {
                    out.append(indent(level)).append("Unary Expression: ").append(node.getKind().toString()).append(formatLocation(node)).append("\n");
                    return super.visitUnary(node, level + 1);
                }

                @Override
                public Void visitLiteral(LiteralTree node, Integer level) {
                    out.append(indent(level)).append("Literal: ").append(String.valueOf(node.getValue())).append(formatLocation(node)).append("\n");
                    return super.visitLiteral(node, level + 1);
                }

                @Override
                public Void visitAssignment(AssignmentTree node, Integer level) {
                    out.append(indent(level)).append("Assignment").append(formatLocation(node)).append("\n");
                    return super.visitAssignment(node, level + 1);
                }

                @Override
                public Void visitMethodInvocation(MethodInvocationTree node, Integer level) {
                    out.append(indent(level)).append("Method Invocation: ").append(node.getMethodSelect().toString()).append(formatLocation(node)).append("\n");
                    return super.visitMethodInvocation(node, level + 1);
                }

                @Override
                public Void visitNewClass(NewClassTree node, Integer level) {
                    out.append(indent(level)).append("New Class Instance: ").append(node.getIdentifier().toString()).append(formatLocation(node)).append("\n");
                    return super.visitNewClass(node, level + 1);
                }

                @Override
                public Void visitNewArray(NewArrayTree node, Integer level) {
                    out.append(indent(level)).append("New Array").append(formatLocation(node)).append("\n");
                    return super.visitNewArray(node, level + 1);
                }

                @Override
                public Void visitArrayAccess(ArrayAccessTree node, Integer level) {
                    out.append(indent(level)).append("Array Access").append(formatLocation(node)).append("\n");
                    return super.visitArrayAccess(node, level + 1);
                }

                @Override
                public Void visitParameterizedType(ParameterizedTypeTree node, Integer level) {
                    out.append(indent(level)).append("Parameterized Type: ").append(node.getType().toString()).append(formatLocation(node)).append("\n");
                    return super.visitParameterizedType(node, level + 1);
                }

                @Override
                public Void visitMemberSelect(MemberSelectTree node, Integer level) {
                    out.append(indent(level)).append("Member Select: ").append(node.getIdentifier().toString()).append(formatLocation(node)).append("\n");
                    return super.visitMemberSelect(node, level + 1);
                }

                @Override
                public Void visitIdentifier(IdentifierTree node, Integer level) {
                    out.append(indent(level)).append("Identifier: ").append(node.getName().toString()).append(formatLocation(node)).append("\n");
                    return super.visitIdentifier(node, level + 1);
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