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
    return `[${start.line+1}:${start.character+1}-${end.line+1}:${end.character+1}] `;
  }

  private parseImportDeclaration(node: ts.ImportDeclaration) {
    this.ast += 'ImportDeclaration ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ' )\n';
  }

  private parseFunctionFeclaration(node: ts.FunctionDeclaration) {
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
    this.ast += 'Identifier ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    this.ast += node.getText();
    this.ast += ' )\n';
  }

  private parseStringLiteral(node: ts.StringLiteral) {
    this.ast += 'StringLiteral ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    this.ast += node.getText();
    this.ast += ' )\n';
  }

  private parseClassDeclaration(node: ts.ClassDeclaration) {
    this.ast += 'ClassDeclaration ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ' )\n';
  }

  private parseCallExpression(node: ts.CallExpression) {
    this.ast += 'CallExpression ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ' )\n';
  }

  private parsePropertyAccessExpression(node : ts.PropertyAccessExpression) {
    this.ast += 'PropertyAccessExpression ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ' )\n';   
  }

  private parsePropertyDeclaration(node : ts.PropertyDeclaration) {
    this.ast += 'PropertyDeclaration ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ' )\n';   
  }

  private parse(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration:
        this.parseImportDeclaration(node as ts.ImportDeclaration);
        break;
      case ts.SyntaxKind.FunctionDeclaration:
        this.parseFunctionFeclaration(node as ts.FunctionDeclaration);
        break;
      case ts.SyntaxKind.TypeReference:
        this.ast += node.getText();
        break;
      case ts.SyntaxKind.PropertyDeclaration:
        this.parsePropertyDeclaration(node as ts.PropertyDeclaration);
        break;
      case ts.SyntaxKind.Identifier:
        this.parseIdentifier(node as ts.Identifier);
        break;
      case ts.SyntaxKind.AsKeyword:
        this.ast += "AsKeyword ";
        break;
      case ts.SyntaxKind.FromKeyword:
        this.ast += "FromKeyowrd ";
        break;
      case ts.SyntaxKind.DotToken:
        this.ast += "DotToken ";
        break;
      case ts.SyntaxKind.ThisKeyword:
        this.ast += "ThisKeyword " + this.locationize(node);
        break;
      case ts.SyntaxKind.ColonToken:
        this.ast += "ColonToken ";
        break;
      case ts.SyntaxKind.ClassKeyword:
        this.ast += "ClassKeyword ";
        break;
       case ts.SyntaxKind.AsteriskToken:
        this.ast += "AsteriskToken ";
        break;
       case ts.SyntaxKind.OpenBraceToken:
        this.ast += "{ ";
        break;
      case ts.SyntaxKind.CloseBraceToken:
        this.ast += "} ";
        break;
      case ts.SyntaxKind.PropertyAccessExpression:
        this.parsePropertyAccessExpression(node as ts.PropertyAccessExpression);
        break;
      case ts.SyntaxKind.StringLiteral:
        this.parseStringLiteral(node as ts.StringLiteral);
        break;
      case ts.SyntaxKind.ClassDeclaration:
        this.parseClassDeclaration(node as ts.ClassDeclaration);
        break;
      case ts.SyntaxKind.CallExpression:
        this.parseCallExpression(node as ts.CallExpression);
        break;
      // ignore the following
      // deliberately fall-through
      case ts.SyntaxKind.SemicolonToken:
      case ts.SyntaxKind.ExportKeyword:
      case ts.SyntaxKind.PrivateKeyword:
      case ts.SyntaxKind.ReadonlyKeyword:
      case ts.SyntaxKind.SemicolonToken:
        break;
      default:
        if (node.kind != ts.SyntaxKind.SyntaxList) {
          this.ast += 'add support for: ' + `${node.kind}\n`;
        }
        const numchilds = node.getChildCount();
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
