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
    this.ast += ')\n';
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
    this.ast += ');\n';
  }

  private parseTypeReference(node: ts.TypeReferenceNode) {
    this.ast += 'TypeReference ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }    
    this.ast += ')';
  }

  private parseIdentifier(node: ts.Identifier) {
    this.ast += 'Identifier ';
    this.ast += this.locationize(node);
    this.ast += '(';
    this.ast += node.getText();
    this.ast += ') ';
  }

  private parseQualifiedName(node: ts.QualifiedName) {
    this.ast += 'QualifiedName ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }    
    this.ast += ')';
  }

  private parseStringLiteral(node: ts.StringLiteral) {
    this.ast += 'StringLiteral ';
    this.ast += this.locationize(node);
    this.ast += '(';
    this.ast += node.getText();
    this.ast += ') ';
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
    this.ast += ')\n';
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
    this.ast += ')\n';
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
    this.ast += ')\n';   
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
    this.ast += ')\n';   
  }

  private parseParameter(node : ts.ParameterDeclaration) {
    this.ast += 'Parameter ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ')\n';   
  }

  private parseConstructor(node : ts.ConstructorDeclaration) {
    this.ast += 'Constructor ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ')\n';   
  }

  private parseVariableStatement(node : ts.VariableStatement) {
    this.ast += 'VariableStatement ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ')\n';   
  }

 private parseMethodDeclaration(node : ts.MethodDeclaration) {
    this.ast += 'MethodDeclaration ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ')\n';   
  }

  private parseVariableDeclarationList(node : ts.VariableDeclarationList) {
    this.ast += 'VariableDeclarationList ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ')\n';   
  }

  private parseVariableDeclaration(node : ts.VariableDeclaration) {
    this.ast += 'VariableDeclaration ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ')\n';   
  }

  private parseBlock(node : ts.Block) {
    this.ast += 'Block ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ')\n';   
  }

  private parseExpressionStatement(node : ts.ExpressionStatement) {
    this.ast += 'ExpressionStatement ';
    this.ast += this.locationize(node);
    this.ast += '( ';
    const numchilds = node.getChildCount();
    for (let i=0;i<numchilds;i++) {
      const childi = node.getChildAt(i);
      this.parse(childi);
    }
    this.ast += ')\n';   
  }

  private parse(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration:
        this.parseImportDeclaration(node as ts.ImportDeclaration);
        break;
      case ts.SyntaxKind.FunctionDeclaration:
        this.parseFunctionFeclaration(node as ts.FunctionDeclaration);
        break;
      case ts.SyntaxKind.PropertyDeclaration:
        this.parsePropertyDeclaration(node as ts.PropertyDeclaration);
        break;
      case ts.SyntaxKind.QualifiedName:
        this.parseQualifiedName(node as ts.QualifiedName);
        break;
      case ts.SyntaxKind.Block:
        this.parseBlock(node as ts.Block);
        break;
      case ts.SyntaxKind.ExpressionStatement:
        this.parseExpressionStatement(node as ts.ExpressionStatement);
        break;
      case ts.SyntaxKind.VariableDeclaration:
        this.parseVariableDeclaration(node as ts.VariableDeclaration);
        break;
      case ts.SyntaxKind.VariableDeclarationList:
        this.parseVariableDeclarationList(node as ts.VariableDeclarationList);
        break;
      case ts.SyntaxKind.VariableStatement:
        this.parseVariableStatement(node as ts.VariableStatement);
        break;
      case ts.SyntaxKind.MethodDeclaration:
        this.parseMethodDeclaration(node as ts.MethodDeclaration);
        break;
      case ts.SyntaxKind.TypeReference:
        this.parseTypeReference(node as ts.TypeReferenceNode);
        break;
      case ts.SyntaxKind.Constructor:
        this.parseConstructor(node as ts.ConstructorDeclaration);
        break;
      case ts.SyntaxKind.Parameter:
        this.parseParameter(node as ts.ParameterDeclaration);
        break;
      case ts.SyntaxKind.Identifier:
        this.parseIdentifier(node as ts.Identifier);
        break;
      case ts.SyntaxKind.CommaToken:
        this.ast += ", ";
        break;
      case ts.SyntaxKind.EqualsToken:
        this.ast += "= ";
        break;
      case ts.SyntaxKind.StringKeyword:
        this.ast += "StringKeyword " + this.locationize(node);
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
        this.ast += ts.SyntaxKind[node.kind] + this.locationize(node);
        break;
      case ts.SyntaxKind.ConstructorKeyword:
        this.ast += "ConstructorKeyword " + this.locationize(node);
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
      case ts.SyntaxKind.OpenParenToken:
        this.ast += "( ";
        break;
      case ts.SyntaxKind.CloseParenToken:
        this.ast += ") ";
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
      case ts.SyntaxKind.ConstKeyword:
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
