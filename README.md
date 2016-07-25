# lazy-blur.js

[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/lazy-blur.js) [![Join the chat at https://gitter.im/Rplus/lazy-blur.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Rplus/lazy-blur.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A progressive image loader library with SVG blur effect.

![screenshot for library effect](https://lh3.googleusercontent.com/dZisilyOaq8OEsHVn0ViEhVSXF5_dAZ-vECq5rKzltF00bxI0B7WQqFrMtDBlR3qypJgvCx0Pfkj-pl5tY3D4hdDJctntnhDCq_t0XJ2Ic78cpoBnoGEwlCv6lOs20Mw0gtkjr2iPNl_5YVI1gwUsYq1VeT6II7OrnFkjN_4D0FaT6jfqZXzrNJj_c3gsWixOER5847Cst6mhqfqf2D1NjBOPN0NK3DVmKgX9hiKYwcQzFe5XfA8KGJESUJvvJhQV2-rIl1wSiITJ8n4VDlpVf7r1qK6VneiKakKGUMopjF4Hly5KuiRomEGKuetym_qzA6ldjTr_l_7EBRwgwRvztbthQAQItsl6I1LYl84FmeEhECcKPWF6b_EbFx23XwQEFoyn150YcIi7t3IZAcivtqbdhRZV9Ovm7amcLB-AaUjOcYQJxgSwEWQEbGgxjv14dzS2bJcI5GsdvXoYx1AWeQlxE_ywZgwXeurbhcSxMF3B4xVO16k-8bmjTDTSx2vQ6mJrbCN1n1ui-_aSr6Eqy2A03mmTBOL7s2Llm2hY6BOBNXlL6JBGp9eDz13VfrC9jjX=w347-h474-no)

* [Demo page](http://rplus.github.io/lazy-blur.js/demo.html)
* [try it on jsbin](https://jsbin.com/tuhoha/6/edit)

## Usage

steps:

1. [install](#install)
2. [image setup](#setup)
3. [initialize library](#initialize)

### <a name="install"></a>Install

You could [download this script directly](https://github.com/Rplus/lazy-blur.js/raw/master/dist/lazy-blur.min.js)
or [install via npm](https://www.npmjs.com/package/lazy-blur.js).

```bash
npm install lazy-blur.js
```

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
| eventType       | String   | `'scroll'`           | The event to active loading large images.<br>optional: `'scroll'`, `'click'`, `'mouseenter'` |
| blurSize        | Number   | `20`                 | value of svg gaussian blur filter. larger is more blurred.                                  |
| scrollThreshold | Number   | `50`                 | distance of scroll threshold (buffer), unit: `px`                                           |
| filterSelector  | String   | `'html.svg *:not(.done) > ' + opt.imgSQuery`                    | css selector for small images with SVG filter.   |
| getImgLSrc      | Function | `function (imgS) { return imgS.getAttribute('data-src'); }`     | function for getting large image's source url.   |
| onLoad          | Function | `function (imgS) { imgS.parentElement.className += ' done '; }` | callback for large image loaded.                 |

## Browser support

## License

MIT. © 2015 Rplus
