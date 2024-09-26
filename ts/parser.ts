import * as ts from "typescript";

export class Parser {
  private readonly sourceFile: ts.SourceFile;
  private /* immutable */ ast: string = "";
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
    return `[${start.line+1}:${start.character+1}-${end.line+1}:${end.character+1}]`;
  }

  private parse(node: ts.Node) {
    switch (node.kind) {
      // ignore the following:
      // ( deliberately fall-through )
      case ts.SyntaxKind.SemicolonToken:
      case ts.SyntaxKind.ExportKeyword:
      case ts.SyntaxKind.PrivateKeyword:
      case ts.SyntaxKind.ReadonlyKeyword:
      case ts.SyntaxKind.ConstKeyword:
        break;
      default:
        this.ast += ts.SyntaxKind[node.kind];
        this.ast += this.locationize(node);
        this.ast += '(';
        const numchilds = node.getChildCount();
        for (let i=0;i<numchilds;i++) {
          const childi = node.getChildAt(i);
          this.parse(childi);
        }
        this.ast += ')';
    }
  }

  public run() {
    const numchilds = this.sourceFile.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = this.sourceFile.getChildAt(i);
      this.parse(childi);
    }
    return this.ast;
  }
}
