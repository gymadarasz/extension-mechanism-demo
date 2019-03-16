import { Compiler, Component, Injector, SkipSelf, ViewChild, ViewContainerRef } from '@angular/core';

declare const SystemJS;

@Component({
    selector: 'myapp',
    template: `
        I am App Component
        <div>
            <ng-container #vc></ng-container>
        </div>
    `
})
export class CaAppComponent {
    @ViewChild('vc', {read: ViewContainerRef}) vc;

    constructor(private compiler: Compiler, @SkipSelf() private injector: Injector) {
    }

    ngOnInit() {
        SystemJS.import('extension/dist/a.module.js').then((module) => {
            
            console.log(module);
            try {
                const moduleFactory = this.compiler.compileModuleSync(module.default);
                const moduleRef = moduleFactory.create(this.injector);
                const widgets = moduleRef.injector.get('widgets');
                const resolver = moduleRef.componentFactoryResolver;
                const componentFactory = resolver.resolveComponentFactory(widgets[0][0].component);
                this.vc.createComponent(componentFactory);
            } catch (e) {
                console.log('problem with loading custom, load origin...');
                
                SystemJS.import('extension/dist/a.module.js').then((module) => {
                console.log(module);
                            const moduleFactory = this.compiler.compileModuleSync(module.default);
                            const moduleRef = moduleFactory.create(this.injector);
                            const widgets = moduleRef.injector.get('widgets');
                            const resolver = moduleRef.componentFactoryResolver;
                            const componentFactory = resolver.resolveComponentFactory(widgets[0][0].component);
                            this.vc.createComponent(componentFactory);
                        });
            }
        });
    }
}