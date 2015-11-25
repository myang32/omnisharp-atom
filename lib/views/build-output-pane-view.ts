/* tslint:disable:no-string-literal */
/* tslint:disable:variable-name */
const Convert = require("ansi-to-html");
/* tslint:enable:variable-name */
const _ : _.LoDashStatic = require("lodash");
import * as React from "react";
import {ReactClientComponent} from "./react-client-component";
import {server} from "../atom/server-information";

interface IBuildOutputWindowState {
    output: OutputMessage[];
}

export class BuildOutputWindow<T> extends ReactClientComponent<T, IBuildOutputWindowState> {
    public displayName = "BuildOutputWindow";

    private _convert: any;

    constructor(props?: T, context?: any) {
        super(props, context);
        this._convert = new Convert();
        this.state = { output: [] };
    }

    public componentDidMount() {
        super.componentDidMount();
        this.disposable.add(server.observe.output
            .subscribe(z => this.setState({ output: z }, () => this.scrollToBottom())));
        this.scrollToBottom();
    }

    private scrollToBottom() {
        const item = <any> React.findDOMNode(this).lastElementChild.lastElementChild;
        if (item) item.scrollIntoViewIfNeeded();
    }

    private createItem(item: OutputMessage) {
        return React.DOM.pre({
            className: item.logLevel,
        }, this._convert.toHtml(item.message).trim());
    }

    public render() {
        return React.DOM.div({
            className: "build-output-pane-view native-key-bindings " + (this.props["className"] || ""),
            tabIndex: -1
        },
            React.DOM.div({
                className: "messages-container"
            }, _.map(this.state.output, item => this.createItem(item))));
    }
}