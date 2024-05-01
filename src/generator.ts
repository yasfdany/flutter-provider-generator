import * as fs from "fs";
import * as cp from "child_process";

export async function generateTemplate(featureName: string, folderPath: string) {
    await fs.mkdir(`${folderPath}/${featureName}`, { recursive: true }, async (err) => {
        if (err) {
            return false;
        }

        const providerName = toPascalCase(`${featureName}_provider`);
        const stateName = toPascalCase(`${featureName}_state`);
        const pageName = toPascalCase(`${featureName}_page`);

        const providerString: string = generateProviderString(featureName, providerName, stateName);
        const stateString: string = generateStateString(stateName);
        const pageString: string = generatePageString(featureName, pageName, providerName);

        await fs.writeFile(`${folderPath}/${featureName}/${featureName}_provider.dart`, providerString, (err) => {});
        await fs.writeFile(`${folderPath}/${featureName}/${featureName}_state.dart`, stateString, (err) => {});
        await fs.writeFile(`${folderPath}/${featureName}/${featureName}_view.dart`, pageString, (err) => {});
        await cp.exec(`dart format ${folderPath}/${featureName}`, (err, stdout, stderr) => {});
    });
    return true;
}

function generatePageString(featureName: string, pageName: string, providerName: string): string {
    return `import 'package:flutter/material.dart';\nimport 'package:provider/provider.dart';\n\nimport '${featureName}_provider.dart';\n\nclass ${pageName} extends StatelessWidget {\n\tconst ${pageName}({super.key});\n\n\t@override\n\tWidget build(BuildContext context) {\n\t\treturn ChangeNotifierProvider(\n\t\t\tcreate: (BuildContext context) => ${providerName}(),\n\t\t\tbuilder: (context, child) => _buildPage(context),\n\t\t);\n\t}\n\n\tWidget _buildPage(BuildContext context) {\n\t\tfinal provider = context.read<${providerName}>();\n\t\tfinal _ = provider.state;\n\n\t\treturn const Scaffold();\n\t}\n}\n`;
}

function generateStateString(stateName: string): string {
    return `class ${stateName} {\n\t// Create your state here\n}\n`;
}

function generateProviderString(featureName: string, providerName: string, stateName: string): string {
    return `import 'package:flutter/material.dart';\n\nimport '${featureName}_state.dart';\n\nclass ${providerName} extends ChangeNotifier {\n\tfinal state = ${stateName}();\n}\n`;
}

function toPascalCase(string: string) {
    return string.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}