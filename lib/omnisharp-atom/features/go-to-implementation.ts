import Omni = require('../../omni-sharp-server/omni')
import OmniSharpAtom = require('../omnisharp-atom')

class GoToImplementation {
    private disposable: { dispose: () => void; }
    private atomSharper: typeof OmniSharpAtom;

    constructor(atomSharper: typeof OmniSharpAtom) {
        this.atomSharper = atomSharper;
    }

    public goToImplementation() {
        Omni.request(client => client.findimplementations(client.makeRequest()));
    }

    public activate() {
        this.disposable = atom.workspace.observeTextEditors((editor) => { });

        this.atomSharper.addCommand("omnisharp-atom:go-to-implementation", () => {
            return this.goToImplementation();
        });

        Omni.listener.observeFindimplementations.subscribe((data) => {
            if (data.response.QuickFixes.length == 1) {
                Omni.navigateTo(data.response.QuickFixes[0]);
            }
        });
    }

    public deactivate() {
        this.disposable.dispose()
    }
}
export = GoToImplementation
