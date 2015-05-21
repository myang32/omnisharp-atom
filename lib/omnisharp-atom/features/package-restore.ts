import path = require('path');
import ClientManager = require('../../omni-sharp-server/client-manager');
import Omni = require('../../omni-sharp-server/omni');
import OmniSharpAtom = require('../omnisharp-atom');

class PackageRestore {
    private editorDestroyedSubscription: EventKit.Disposable;
    constructor(private atomSharper: typeof OmniSharpAtom) {
        this.registerEventHandlerOnEditor = this.registerEventHandlerOnEditor;
        this.activate = this.activate;
        this.atomSharper = atomSharper;
    }

    public activate = () => {
        this.atomSharper.onConfigEditor((editor: Atom.TextEditor) => this.registerEventHandlerOnEditor(editor));
        this.editorDestroyedSubscription = this.atomSharper.onConfigEditorDestroyed((filePath) => { });
    }

    public registerEventHandlerOnEditor = (editor: Atom.TextEditor) => {
        var filename = path.basename(editor.getPath());
        if (filename === 'project.json') {
            return editor.getBuffer().onDidSave(() => {

                ClientManager.getClientForEditor(editor)
                    .subscribe(client => client.filesChanged([{
                        FileName: editor.getPath()
                    }]));
            });
        }
    }

    public deactivate = function() {
        this.editorSubscription.destroy();
    }
}

export = PackageRestore;
