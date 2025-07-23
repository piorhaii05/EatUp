/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/comps/LoginScreen`; params?: Router.UnknownInputParams; } | { pathname: `/comps/SplashScreen`; params?: Router.UnknownInputParams; } | { pathname: `/comps/WelcomeScreen`; params?: Router.UnknownInputParams; } | { pathname: `/navigation/AppNavigator`; params?: Router.UnknownInputParams; } | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/comps/LoginScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/comps/SplashScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/comps/WelcomeScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/navigation/AppNavigator`; params?: Router.UnknownOutputParams; } | { pathname: `/+not-found`, params: Router.UnknownOutputParams & {  } };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/comps/LoginScreen${`?${string}` | `#${string}` | ''}` | `/comps/SplashScreen${`?${string}` | `#${string}` | ''}` | `/comps/WelcomeScreen${`?${string}` | `#${string}` | ''}` | `/navigation/AppNavigator${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/comps/LoginScreen`; params?: Router.UnknownInputParams; } | { pathname: `/comps/SplashScreen`; params?: Router.UnknownInputParams; } | { pathname: `/comps/WelcomeScreen`; params?: Router.UnknownInputParams; } | { pathname: `/navigation/AppNavigator`; params?: Router.UnknownInputParams; } | `/+not-found` | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
    }
  }
}
