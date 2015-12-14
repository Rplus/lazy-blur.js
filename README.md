# lazy-blur.js

[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/lazy-blur.js) [![Join the chat at https://gitter.im/Rplus/lazy-blur.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Rplus/lazy-blur.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A progressive image loader library with SVG blur effect.

* [Demo page](http://rplus.github.io/lazy-blur.js/)
* [try it on plnkr](http://plnkr.co/)

## Usage

steps:

1. [install](#install)
2. [image setup](#setup)
3. [initialize library](#initialize)

### <a name="install"></a>Install

[download this script]()

```html
<script src="lazy-blur.min.js"></script>
```

### <a name="setup"></a>Image setup

* #### requirement

  * **`imgRatio`**, img-width / img-height, unit: `%`
  * **`imgS.url`**
  * **`imgL.url`**

* #### html markup

  ```html
  <figure class="image">
    <div class="lazy-blur">
      <div style="padding-bottom: ${imgRatio}"><!-- lazy-blur__imgS__placeholder --></div>
      <img src="${imgS.url}" data-src="${imgL.url}" class="lazy-blur__imgS"/>
      <noscript><img src="${imgL.url}"/></noscript>
    </div>
    <figcaption>something~</figcaption>
  </figure>
  ```

* #### css style

  ```css
  .lazy-blur {
    position: relative;
    overflow: hidden;
  }
  .lazy-blur img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .lazy-blur__imgL {
    opacity: 0;
    transition: opacity .3s;
  }
  .done > .lazy-blur__imgL {
    opacity: 1;
  }
  ```

#### <a name="initialize"></a>initialize library

```js
new LazyBlur();
```

### Options

All options are optional.

```js
new LazyBlur({
  imgSQuery: ,
  imgLClass: ,
  filterSelector: ,
  getImgLSrc: ,
  onLoad: ,
  blurSize: ,
  scrollThreshold: ,
  eventType:
});
```

| Options         | Type     | Default              | Description                                                                                 |
|:----------------|:---------|:---------------------|:--------------------------------------------------------------------------------------------|
| imgSQuery       | String   | `'.lazy-blur__imgS'` | query selector of small images. <br>used in `document.querySelectorAll`.                    |
| imgLClass       | String   | `'lazy-blur__imgL'`  | class name of large images loaded by lazy-blur.js.                                          |
| eventType       | String   | `'scroll'`           | The event to active loading large images.<br>optional: `'scroll'`, `'click'`, `'mouseover'` |
| blurSize        | Number   | `20`                 | value of svg gaussian blur filter. larger is more blurred.                                  |
| scrollThreshold | Number   | `50`                 | distance of scroll threshold (buffer), unit: `px`                                           |
| filterSelector  | String   | `'html.svg *:not(.done) > ' + opt.imgSQuery`                    | css selector for small images with SVG filter.   |
| getImgLSrc      | Function | `function (imgS) { return imgS.getAttribute('data-src'); }`     | function for getting large image's source url.   |
| onLoad          | Function | `function (imgS) { imgS.parentElement.className += ' done '; }` | callback for large image loaded.                 |

## Browser support

## License

MIT. © 2015 Rplus
