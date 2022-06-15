/* tslint:disable: no-shadowed-variable */
import { assert } from '@amaui/test';

import { startBrowsers, IBrowsers, evaluate, closeBrowsers } from '../utils/js/test/utils';

group('@amaui/cookie', () => {
  let browsers: IBrowsers;

  pre(async () => browsers = await startBrowsers());

  preTo(async () => {
    await evaluate((window: any) => window.AmauiCookie.clear, { browsers });
  });

  post(async () => {
    await closeBrowsers(browsers);
  });

  group('AmauiCookie', () => {

    preTo(async () => {
      await evaluate((window: any) => window.AmauiCookie.clear, { browsers });
    });

    to('cookie', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        const amauiCookie = new window.AmauiCookie();

        amauiCookie.add('a', 'a');
        amauiCookie.add('ab', 4);
        amauiCookie.add('ad', 4);

        return window.AmauiCookie.cookie;
      }, { browsers });
      const values = [...valueBrowsers];

      values.forEach(value => {
        assert(value).eql('AMAUI_a=a; AMAUI_ab=4; AMAUI_ad=4');
      });
    });

    to('clear', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        const amauiCookie = new window.AmauiCookie();

        amauiCookie.add('a', 'a');
        amauiCookie.add('ab', 4);
        amauiCookie.add('ad', 4);

        window.document.cookie = `a=a`;

        window.AmauiCookie.clear;

        return window.AmauiCookie.cookie;
      }, { browsers });
      const values = [...valueBrowsers];

      values.forEach(value => {
        assert(value).eq('');
      });
    });

  });

  group('options', () => {

    preTo(async () => {
      await evaluate((window: any) => window.AmauiCookie.clear, { browsers });
    });

    group('namespace', () => {

      preTo(async () => {
        await evaluate((window: any) => window.AmauiCookie.clear, { browsers });
      });

      to('default', async () => {
        const valueBrowsers = await evaluate((window: any) => new window.AmauiCookie().namespace, { browsers });
        const values = [...valueBrowsers];

        values.forEach(value => {
          assert(value).eq('AMAUI_');
        });
      });

      to('namespace', async () => {
        const valueBrowsers = await evaluate((window: any) => new window.AmauiCookie({ namespace: 'a' }).namespace, { browsers });
        const values = [...valueBrowsers];

        values.forEach(value => {
          assert(value).eq('a_');
        });
      });

      to('namespace_separator', async () => {
        const valueBrowsers = await evaluate((window: any) => new window.AmauiCookie({ namespace_separator: ',' }).namespace, { browsers });
        const values = [...valueBrowsers];

        values.forEach(value => {
          assert(value).eq('AMAUI,');
        });
      });

      to('namespace in a document cookie', async () => {
        const valueBrowsers = await evaluate((window: any) => {
          const amauiCookie = new window.AmauiCookie();

          amauiCookie.add('a', 'a');
          amauiCookie.add('ab', 4);
          amauiCookie.add('ad', 4);

          return window.AmauiCookie.cookie;
        }, { browsers });
        const values = [...valueBrowsers];

        values.forEach(value => {
          assert(value).one.eq([
            'AMAUI_a=a; AMAUI_ab=4; AMAUI_ad=4',
            'AMAUI_ab=4; AMAUI_ad=4; AMAUI_a=a'
          ]);
        });
      });

    });

  });

  to('properties', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      const amauiCookie = new window.AmauiCookie();

      amauiCookie.add('a', 4);
      amauiCookie.add('ab', 4);
      amauiCookie.add('ad', 4);

      return amauiCookie.properties;
    }, { browsers });
    const values = [...valueBrowsers];

    values.forEach(value => {
      assert(value.sort()).eql(['a', 'ab', 'ad']);
    });
  });

  to('values', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      const amauiCookie = new window.AmauiCookie();

      amauiCookie.add('a', 'a');
      amauiCookie.add('ab', 4);
      amauiCookie.add('ad', 4);

      return amauiCookie.values;
    }, { browsers });
    const values = [...valueBrowsers];

    values.forEach(value => {
      assert(value.sort()).eql([4, 4, 'a']);
    });
  });

  to('items', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      const amauiCookie = new window.AmauiCookie();

      amauiCookie.add('a', 'a');
      amauiCookie.add('ab', 4);
      amauiCookie.add('ad', 4);

      return amauiCookie.items;
    }, { browsers });
    const values = [...valueBrowsers];

    values.forEach(value => {
      assert(value).eql({
        a: 'a',
        ab: 4,
        ad: 4,
      });
    });
  });

  to('clear', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      const amauiCookie = new window.AmauiCookie();

      amauiCookie.add('a', 'a');
      amauiCookie.add('ab', 4);
      amauiCookie.add('ad', 4);

      window.document.cookie = `a=4`;

      amauiCookie.clear;

      return window.AmauiCookie.cookie;
    }, { browsers });
    const values = [...valueBrowsers];

    values.forEach(value => {
      assert(value).eq('a=4');
    });
  });

  to('get', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      const amauiCookie = new window.AmauiCookie();

      amauiCookie.add('a', 'a');

      return amauiCookie.get('a');
    }, { browsers });
    const values = [...valueBrowsers];

    values.forEach(value => {
      assert(value).eq('a');
    });
  });

  to('has', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      const amauiCookie = new window.AmauiCookie();

      amauiCookie.add('a', 'a');

      return amauiCookie.has('a');
    }, { browsers });
    const values = [...valueBrowsers];

    values.forEach(value => {
      assert(value).eq(true);
    });
  });

  group('add', () => {

    to('add', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        const amauiCookie = new window.AmauiCookie();

        amauiCookie.add('a', 'a');

        return [amauiCookie.get('a'), window.document.cookie.indexOf('AMAUI_a=a') > -1];
      }, { browsers });
      const values = [...valueBrowsers];

      values.forEach(value => {
        assert(value).eql(['a', true]);
      });
    });

    to('add reference value', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        const amauiCookie = new window.AmauiCookie();

        amauiCookie.add('a', 'a');
        amauiCookie.add('ay', true);
        amauiCookie.add('au', [1, 4]);
        amauiCookie.add('ao', { a: 'a' });

        return [amauiCookie.get('a'), amauiCookie.get('ay'), amauiCookie.get('au'), window.document.cookie.split('; ')[2], amauiCookie.get('ao')];
      }, { browsers });
      const values = [...valueBrowsers];

      values.forEach(value => {
        assert(value).eql(['a', true, [1, 4], 'AMAUI_au=[1,4]', { a: 'a' }]);
      });
    });

  });

  to('update', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      const amauiCookie = new window.AmauiCookie();

      amauiCookie.add('a', 4);
      amauiCookie.update('a', 'a');

      return [amauiCookie.get('a'), window.document.cookie.indexOf('AMAUI_a=a') > -1];
    }, { browsers });
    const values = [...valueBrowsers];

    values.forEach(value => {
      assert(value).eql(['a', true]);
    });
  });

  to('remove', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      const amauiCookie = new window.AmauiCookie();

      amauiCookie.add('a', 'a');

      amauiCookie.remove('a');

      return [amauiCookie.get('a'), window.document.cookie];
    }, { browsers });
    const values = [...valueBrowsers];

    values.forEach(value => {
      assert(value).eql([undefined, '']);
    });
  });

});
