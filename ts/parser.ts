import * as ts from "typescript";

export class Parser {
  private readonly sourceFile: ts.SourceFile;
  private /* immutable */ ast: string = "";
  constructor(readonly filename: string, readonly sourceCode: string) {
    this.sourceFile =  ts.createSourceFile(
      filename,
      sourceCode,
      ts.ScriptTarget.ES2015,
      true,
      ts.ScriptKind.TS
    );
  }

  private locationize(node: ts.Node) {
    const start = this.sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const end = this.sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    return ` [${start.line+1}:${start.character+1}-${end.line+1}:${end.character}] `;
  }

  private parseImportDeclaration(node: ts.ImportDeclaration) {
    this.ast += 'ImportDeclaration';
    this.ast += this.locationize(node);
    this.ast += '(';
    // node.getChildren().forEach(this.parse);
    this.ast += ');\n';
  }

  private parseFunctionFeclaration(node: ts.FunctionDeclaration) {
    this.ast += 'FunctionDeclaration';
    this.ast += this.locationize(node);
    this.ast += '( ';
    // node.getChildren().forEach(this.parse);
    this.ast += ' );\n';
  }

  private parse(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration:
        // this.parseImportDeclaration(node as ts.ImportDeclaration);
        console.log('Import');
        break;
      case ts.SyntaxKind.FunctionDeclaration:
        console.log('function decl');
        // this.parseFunctionFeclaration(node as ts.FunctionDeclaration);
        break;
      }
  }

  public run() {
    console.log(this.sourceFile);
    this.sourceFile.forEachChild(this.parse);
  }
}
