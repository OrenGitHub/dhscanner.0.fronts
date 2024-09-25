import * as ts from "typescript";

export class Parser {
  private readonly sourceFile: ts.SourceFile;
  private /* immutable */ ast: string = "kokok .... yes";
  constructor(readonly filename: string, private readonly sourceCode: string) {
    this.sourceFile =  ts.createSourceFile(
      filename,
      sourceCode,
      ts.ScriptTarget.ES2015,
      true
    );
  }

  private locationize(node: ts.Node) {
    const start = this.sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const end = this.sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    return ` [${start.line+1}:${start.character+1}-${end.line+1}:${end.character+1}] `;
  }

  private parseImportDeclaration(node: ts.ImportDeclaration) {
    console.log('MMMM');
    this.ast += 'ImportDeclaration';
    this.ast += this.locationize(node);
    this.ast += '(';
    const numchilds = node.getChildCount();
    console.log(`handling ${numchilds} childs now`);
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ');\n';
  }

  private parseFunctionFeclaration(node: ts.FunctionDeclaration) {
    console.log('DDDDDD');
    this.ast += 'FunctionDeclaration';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    
    this.ast += ' );\n';
  }

  private parseIdentifier(node: ts.Identifier) {
    this.ast += 'Identifier';
    this.ast += this.locationize(node);
    this.ast += '( ';
    this.ast += node.getText();
    this.ast += ' )\n';
  }

  private parse(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration:
        this.parseImportDeclaration(node as ts.ImportDeclaration);
        console.log('Import');
        break;
      case ts.SyntaxKind.FunctionDeclaration:
        console.log('function decl');
        this.parseFunctionFeclaration(node as ts.FunctionDeclaration);
        break;
      case ts.SyntaxKind.Identifier:
        console.log('GGGGGGGGG');
        this.parseIdentifier(node as ts.Identifier);
        break;
      default:
        const numchilds = node.getChildCount();
        console.log(`handling ${node.kind}`);
        for (let i=0;i<numchilds;i++) {
          const childi = node.getChildAt(i);
          if (childi) {
            this.parse(childi);
          }
        }
      }
  }

  public run() {
    const numchilds = this.sourceFile.getChildCount();
    console.log(`found ${numchilds} childs`);
    for (let i=0;i<numchilds;i++) {
      const childi = this.sourceFile.getChildAt(i);
      this.parse(childi);
    }
    return this.ast;
  }
}
