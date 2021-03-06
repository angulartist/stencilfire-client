/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';

import '@ionic/core';
import 'ionicons';


export namespace Components {

  interface AppCheckout {
    'billingAmount': number;
    'currentUser': any;
    'formatedInput': number;
  }
  interface AppCheckoutAttributes extends StencilHTMLAttributes {
    'billingAmount'?: number;
    'currentUser'?: any;
    'formatedInput'?: number;
  }

  interface AppConverter {}
  interface AppConverterAttributes extends StencilHTMLAttributes {}

  interface AppDongboard {}
  interface AppDongboardAttributes extends StencilHTMLAttributes {}

  interface AppHeader {}
  interface AppHeaderAttributes extends StencilHTMLAttributes {}

  interface AppMatchmaker {}
  interface AppMatchmakerAttributes extends StencilHTMLAttributes {}

  interface AppRoot {}
  interface AppRootAttributes extends StencilHTMLAttributes {}
}

declare global {
  interface StencilElementInterfaces {
    'AppCheckout': Components.AppCheckout;
    'AppConverter': Components.AppConverter;
    'AppDongboard': Components.AppDongboard;
    'AppHeader': Components.AppHeader;
    'AppMatchmaker': Components.AppMatchmaker;
    'AppRoot': Components.AppRoot;
  }

  interface StencilIntrinsicElements {
    'app-checkout': Components.AppCheckoutAttributes;
    'app-converter': Components.AppConverterAttributes;
    'app-dongboard': Components.AppDongboardAttributes;
    'app-header': Components.AppHeaderAttributes;
    'app-matchmaker': Components.AppMatchmakerAttributes;
    'app-root': Components.AppRootAttributes;
  }


  interface HTMLAppCheckoutElement extends Components.AppCheckout, HTMLStencilElement {}
  var HTMLAppCheckoutElement: {
    prototype: HTMLAppCheckoutElement;
    new (): HTMLAppCheckoutElement;
  };

  interface HTMLAppConverterElement extends Components.AppConverter, HTMLStencilElement {}
  var HTMLAppConverterElement: {
    prototype: HTMLAppConverterElement;
    new (): HTMLAppConverterElement;
  };

  interface HTMLAppDongboardElement extends Components.AppDongboard, HTMLStencilElement {}
  var HTMLAppDongboardElement: {
    prototype: HTMLAppDongboardElement;
    new (): HTMLAppDongboardElement;
  };

  interface HTMLAppHeaderElement extends Components.AppHeader, HTMLStencilElement {}
  var HTMLAppHeaderElement: {
    prototype: HTMLAppHeaderElement;
    new (): HTMLAppHeaderElement;
  };

  interface HTMLAppMatchmakerElement extends Components.AppMatchmaker, HTMLStencilElement {}
  var HTMLAppMatchmakerElement: {
    prototype: HTMLAppMatchmakerElement;
    new (): HTMLAppMatchmakerElement;
  };

  interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {}
  var HTMLAppRootElement: {
    prototype: HTMLAppRootElement;
    new (): HTMLAppRootElement;
  };

  interface HTMLElementTagNameMap {
    'app-checkout': HTMLAppCheckoutElement
    'app-converter': HTMLAppConverterElement
    'app-dongboard': HTMLAppDongboardElement
    'app-header': HTMLAppHeaderElement
    'app-matchmaker': HTMLAppMatchmakerElement
    'app-root': HTMLAppRootElement
  }

  interface ElementTagNameMap {
    'app-checkout': HTMLAppCheckoutElement;
    'app-converter': HTMLAppConverterElement;
    'app-dongboard': HTMLAppDongboardElement;
    'app-header': HTMLAppHeaderElement;
    'app-matchmaker': HTMLAppMatchmakerElement;
    'app-root': HTMLAppRootElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
