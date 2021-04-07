// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "tuya-module-original" is now active!'
  )
  let tips: string = ''
  let fullPath: string = ''
  let timeout: any = null
  let activeEditor = vscode.window.activeTextEditor

  vscode.window.onDidChangeTextEditorSelection(
    (event) => {
      // 当选中字符时
      triggerUpdateDecorations()
    },
    null,
    context.subscriptions
  )

  vscode.window.onDidChangeActiveTextEditor(
    (event) => {
      // 当切换编辑器tab时
      activeEditor = event
    },
    null,
    context.subscriptions
  )

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      // 当切换工作区间 即 切换项目
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations()
      }
    },
    null,
    context.subscriptions
  )

  const triggerUpdateDecorations = () => {
    timeout && clearTimeout(timeout)
    timeout = setTimeout(updateDecorations, 100)
  }

  const updateDecorations = () => {
    if (!activeEditor || !activeEditor.document) {
      tips = ''
      fullPath = ''
      return
    }
    const wordSelect: string = activeEditor.document.getText(
      activeEditor.selection
    )
    const wordarr: Array<string> = wordSelect.split('@tuya-fe')
    if (wordarr.length === 2) {
      const endStr = wordarr[1].split("'")[0]
      if (endStr.indexOf('moon') !== -1) {
        tips = 'http://moon.fast-daily.tuya-inc.cn/docs/react/introduce-cn'
      } else if (endStr.indexOf('/next/') !== -1) {
        let urlSuffix = endStr.split('/next/')[1]
        const suffixEnum = (key: string): string => {
          let str = ''
          switch (key) {
            case 'head':
              str = 'head'
              break
            case 'fetch':
            case 'isServer':
              str = 'fetch'
              break
            case 'dynamic':
              str = 'dynamic'
              break
            case 'document':
              str = 'extendscript'
              break
            case 'logger':
              str = 'logger'
              break
            case 'router':
              str = 'route'
              break
            case 'config':
              str = 'config'
              break

            default:
              break
          }
          return str
        }
        tips = `http://nextjs.fast-daily.tuya-inc.cn/${suffixEnum(urlSuffix)}`
      }
      fullPath = `@tuya-fe${endStr}`
    } else {
      tips = ''
      fullPath = ''
    }
  }
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'tuya-module-original.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage('欢迎使用tuya引用便捷查看插件')
    }
  )

  function provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const hoverText = document.getText(
      document.getWordRangeAtPosition(position)
    )
    // console.log(`Hello World ${fileName}, ${word}`)
    if (tips && fullPath.indexOf(hoverText) != -1)
      return new vscode.Hover(`URL: ${tips}`)
  }
  context.subscriptions.push(disposable)
  // 注册鼠标悬停提示
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      // 暂时只对react的typescript有效果
      [
        { scheme: 'file', language: 'typescriptreact' },
        { scheme: 'file', language: 'typescript' },
      ],
      {
        provideHover,
      }
    )
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
