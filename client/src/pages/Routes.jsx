import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Header } from "../components/Header";
import { MainPages } from "../containers/MainPages";

export const Routes = () => (
    <BrowserRouter>
        <React.Fragment>
            <Switch>
                <Route path="/" exact component={Header} />
                <Route path="/main" exact component={MainPages} />
            </Switch>
        </React.Fragment>
    </BrowserRouter>
);


