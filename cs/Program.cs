using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using System.Text;
using System.Linq;
using System.IO;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("/to/native/cs/ast", async (HttpRequest request, ILogger<Program> logger) =>
{
    if (request.HasFormContentType == false) {
        return Results.BadRequest("File not found.");
    }

    if (request.Form.Files["source"] == null) {
        return Results.BadRequest("File not found.");
    }

    var file = request.Form.Files["source"];
    var filename = file.FileName;
    
    // Read the file content
    using var reader = new StreamReader(file.OpenReadStream());
    string sourceCode = await reader.ReadToEndAsync();

    // Parse the source code into a syntax tree
    var syntaxTree = CSharpSyntaxTree.ParseText(sourceCode);

    if (syntaxTree is null) {
        return Results.BadRequest("File not found.");
    }

    // return Results.Json(new { key = filename });

    // Get the root node of the syntax tree
    var root = syntaxTree.GetRoot();

    // Stringify the root node with locations
    var result = Stringify(root);

    // Return the AST as JSON
    return Results.Text(result);
});

app.Run();

string Stringify(SyntaxNode node)
{
    // Use StringBuilder for better performance
    var result = new StringBuilder();
    
    // Extract the location of the node
    var location = node.GetLocation();
    var locationContent = "";
    if (location.IsInSource) {
        var lineSpan = location.GetLineSpan();
        var startLine = lineSpan.StartLinePosition.Line + 1;
        var startColumn = lineSpan.StartLinePosition.Character + 1;
        var endLine = lineSpan.EndLinePosition.Line + 1;
        var endColumn = lineSpan.EndLinePosition.Character + 1;
        locationContent += $"startLine:{startLine},";
        locationContent += $"startColumn:{startColumn},";
        locationContent += $"endLine:{endLine},";
        locationContent += $"endColumn:{endColumn}";
    }
    var locationString = "location:{" + locationContent + "}";
    
    result.Append("{");
    result.Append($"kind:{node.Kind()},");
    var children = node.ChildNodes();
    var val = "null";
    if (children.Any() == false) {
        val = node.ToString()
            .Replace(";", "")
            .Replace(" ", "")
            .Replace(":", "")
            .Replace("\"", "");
    }
    result.Append($"value:{val},");
    result.Append($"{locationString},");

    
    result.Append("children: [");
    if (children.Any())
    {    
        result.Append(string.Join(",", children.Select(c => Stringify(c))));
    }
    result.Append("]");

    result.Append("}");
    return result.ToString();
}
