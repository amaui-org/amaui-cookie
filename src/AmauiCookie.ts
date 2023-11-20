import is from '@amaui/utils/is';
import isEnvironment from '@amaui/utils/isEnvironment';
import merge from '@amaui/utils/merge';
import serialize from '@amaui/utils/serialize';
import parse from '@amaui/utils/parse';

export interface IOptions {
  namespace?: string;
  namespace_separator?: string;
}

const optionsDefault: IOptions = {
  namespace: 'amaui',
  namespace_separator: '_',
};

class AmauiCookie {
  public options: IOptions;
  public removeNotAllowed: string[] = [];

  public constructor(options: IOptions = optionsDefault) {
    this.options = merge(options, optionsDefault);
  }

  public get namespace(): string {
    return `${this.options.namespace}${this.options.namespace_separator}`;
  }

  public static get cookie(): string {
    return (isEnvironment('browser') && window.document.cookie) || '';
  }

  public static get clear(): void {
    const cookieProperties = AmauiCookie.cookie.split('; ').map(item => item.split('=')[0]);

    return cookieProperties.forEach(value => document.cookie = `${value}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`);
  }

  public get properties(): Array<string> {
    return Object.keys(this.items);
  }

  public get values(): Array<any> {
    const cookies = this.items;

    return Object.keys(cookies).map(property => cookies[property]);
  }

  public get items(): Record<string, any> {
    if (isEnvironment('browser')) {
      const items = {};

      const cookies = AmauiCookie.cookie.split('; ').filter(item => item.indexOf(this.namespace) === 0);

      for (const cookie of cookies) {
        const parts = cookie.split('=');

        items[this.propertyOriginal(parts[0])] = parse(parts.slice(1).join('='));
      }

      return items;
    }
  }

  public get clear(): void {
    return this.properties
      .filter(value => (
        this.removeNotAllowed.indexOf(value) === -1 ||
        this.removeNotAllowed.indexOf(this.propertyOriginal(value)) === -1
      ))
      .forEach(value => this.remove(value));
  }

  public get(name: string): any {
    if (isEnvironment('browser')) {
      const items = this.items;

      return items[name];
    }
  }

  public has(name: string): any {
    if (isEnvironment('browser')) {
      const items = this.items;

      return items.hasOwnProperty(name);
    }
  }

  public add(name_: string, value_: any, days: number = 364, path = '/'): void {
    if (isEnvironment('browser')) {
      const name = this.property(name_);
      const value = !is('string', value_) ? serialize(value_) : value_;
      const expires = (new Date(Date.now() + 86400 * 1000 * days)).toUTCString();

      document.cookie = `${name}=${value}; expires=${expires}; path=${path}`;
    }
  }

  // An alias for add method
  public update(...args: [string, any, number, string]): void {
    return this.add(...args);
  }

  public remove(name: string, path = '/'): void {
    if (isEnvironment('browser')) {
      const items = this.items;

      if (items.hasOwnProperty(name)) document.cookie = `${this.property(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    }
  }

  private property(value: string): string {
    return `${this.namespace}${value}`;
  }

  private propertyOriginal(value: string): string {
    return value.indexOf(this.namespace) === 0 ? value.slice(this.namespace.length) : value;
  }

}

export default AmauiCookie;
