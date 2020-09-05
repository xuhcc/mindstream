import { NgModule } from '@angular/core'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { routes } from './app.routes'

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
