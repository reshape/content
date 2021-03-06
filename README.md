# Reshape Content

[![npm](https://img.shields.io/npm/v/reshape-content.svg?style=flat-square)](https://npmjs.com/package/reshape-content)
[![tests](https://img.shields.io/travis/reshape/content.svg?style=flat-square)](https://travis-ci.org/reshape/content?branch=master)
[![dependencies](https://img.shields.io/david/reshape/content.svg?style=flat-square)](https://david-dm.org/reshape/content)
[![coverage](https://img.shields.io/coveralls/reshape/content.svg?style=flat-square)](https://coveralls.io/r/reshape/content?branch=master)

Flexible content transform for reshape

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

## Why Should You Care?

Rather than having a separate plugin for each kind of content transform you want to be able to do, why not just have one? Parse natural language, markdown, or whatever else you want with a minimalistic and simple interface 🍻

## Install

```bash
npm i reshape-content --save
```

> **Note:** This project is compatible with node v6+ only

## Usage

Start with some html you want to transform in some way. Add attributes of your choosing to an element that has contents you want to transform, and they will be transformed in that order.

```html
<p windoge>Please use windows 98</p>
```

Now pass in an object to `reshape-content`. Each key in the object represents an attribute that will be searched for in the html. The value is a function that will get that element's contents as a string, and replace the contents with whatever string is returned from the function.

```js
const content = require('reshape-content')({
  windoge: (str) => str.replace(/windows/g, 'winDOGE')
})

reshape({ plugins: content })
  .process(html)
  .then((res) => res.output())
```

The plugin will remove the custom attributes from the element and replace its contents with your transformed version. Wow!

```html
<p>Please use winDOGE 98</p>
```

If you return an [A+ compliant promise](https://promisesaplus.com/) from your content function, it will resolve and work in your templates as well.

You can use external libraries for this as well, no problem. Just make sure you are passing in a function that takes a string and returns a string. You might have to wrap the library function if it doesn't behave like this, but it will work with anything that transforms content.

## Examples

#### Markdown

```html
<p md>Wow, it's **Markdown**!</p>
```

```js
const markdown = require('markdown-it')(/* options */)
const content = require('reshape-content')({
  md: (md) => markdown.render(md)
})

reshape({ plugins: content })
  .process(html)
  .then((res) => res.output())
```

```html
<p>Wow, it's <strong>Markdown</strong>!</p>
```

#### PostCSS

```sugarss
<style postcss>
  .test
    text-transform: uppercase;

    &__hello
      color: red;

    &__world
      color: blue;
</style>
```

```js
const postcss = require('postcss')([ require('postcss-nested')() ])
const options = { parser: require('sugarss'), map: false }

const content = require('reshape-content')({
  postcss: (css) => postcss.process(css, options).css
})

reshape({ plugins: content })
  .process(html)
  .then((res) => res.output())

```

```html
<style>
  .test {
    text-transform: uppercase;
  }

  .test__hello {
    color: red;
  }

  .test__world {
    color: blue;
  }
</style>
```

#### Babel

```html
<script babel>
  const hello = 'Hello World!'
  let greeter = {
    greet (msg) { alert (msg) }
  }
  greeter.greet(hello)
</script>
```

```js
const babel = require('babel-core')
const options = { presets: ["es2015"], sourceMaps: false }

const content = require('reshape-content')({
  babel: (js) => babel.transform(js, options).code
})

reshape({ plugins: content })
  .process(html)
  .then((res) => res.output())
```

```html
<script>
  'use strict';
  var hello = "Hello World!";
  var greeter = {
    greet: function greet (msg) {
      alert(msg);
    };
  };
  greeter.greet(hello);
</script>
```

#### Return a Promise

```sugarss
<style postcss>
  .test
    text-transform: uppercase;

    &__hello
      color: red;

    &__world
      color: blue;
</style>
```

```js
const postcss = require('postcss')([ require('postcss-nested')() ])
const options = { parser: require('sugarss'), map: false }

const content = require('reshape-content')({
  postcss: (css) => {
    return postcss.process(css, options).then((res) => res.css)
  }
})

reshape({ plugins: content })
  .process(html)
  .then((res) => res.output())
```

## License & Contributing

- Licensed under [MIT](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)
