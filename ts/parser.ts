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
      // ignore completely:
      // ( deliberately fall-through )
      case ts.SyntaxKind.SemicolonToken:
      case ts.SyntaxKind.TypeKeyword:
      case ts.SyntaxKind.ExportKeyword:
      case ts.SyntaxKind.JSDocComment:
      case ts.SyntaxKind.KeyOfKeyword:
      case ts.SyntaxKind.PrivateKeyword:
      case ts.SyntaxKind.CloseBraceToken:
      case ts.SyntaxKind.ReadonlyKeyword:
      case ts.SyntaxKind.TypeAliasDeclaration:
      case ts.SyntaxKind.FirstPunctuation:
      case ts.SyntaxKind.LetKeyword:
      case ts.SyntaxKind.EndOfFileToken:
      case ts.SyntaxKind.ConstKeyword:
      case ts.SyntaxKind.ExportAssignment:
        break;
      // ignore their children:
      // ( deliberately fall-through )
      case ts.SyntaxKind.ArrowFunction:
      case ts.SyntaxKind.ObjectLiteralExpression:
        this.ast += ts.SyntaxKind[node.kind];
        this.ast += this.locationize(node);
        this.ast += '(';
        this.ast += ')';
        break; 
      // irreplevant children, but important text !
      // ( deliberately fall-through )
      case ts.SyntaxKind.StringLiteral:
      case ts.SyntaxKind.Identifier:
        this.ast += ts.SyntaxKind[node.kind];
        this.ast += this.locationize(node);
        this.ast += '(';
        this.ast += node.getText();
        this.ast += ')';
        break;
      // ignore me, but NOT my children:
      // ( deliberately fall-through )
      case ts.SyntaxKind.SyntaxList:
      case ts.SyntaxKind.FirstStatement:
        for (let i=0;i<node.getChildCount();i++) {
          const childi = node.getChildAt(i);
          this.parse(childi);
        }
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
