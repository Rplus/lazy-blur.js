/* global Image */
class LazyBlur {
  /**
   * @param  {String}       imgSQuery
   *         small imgs' className or imgs' DOM array
   *         default: `.lazy-blur__imgS`
   *
   * @param  {Function}     getSrc
   *         function for getting imgL source url
   *         default: `function (imgS) { return imgS.getAttribute('data-src'); }`
   *
   * @param  {String}       event
   *         event of trigger load images
   *         'click', 'mouseover', 'scroll'
   *
   * @param  {String}       imgLClass
   *         className of imgL
   *         default: 'lazy-blur__imgL'
   *
   * @param  {String}       filterSelector
   *         css selector for SVG filter
   *         default: `html.svg *:not(.done) > ${opt.imgSQuery}`
   *
   * @param  {Number}       blurSize
   *         value of svg gaussian blur filter
   *         default: 20
   *
   * @param  {Function}     callback
   *         after imgL loaded
   *         default: `addClass('done')` for imgS' parent
   */

  constructor (opt = {}) {
    opt = Object.assign({
      imgSQuery: '.lazy-blur__imgS',
      imgLClass: 'lazy-blur__imgL',
      filterSelector: 'html.svg *:not(.done) > ' + opt.imgSQuery,
      getSrc: (imgS) => { return imgS.getAttribute('data-src'); },
      callback: (imgS) => { imgS.parentElement.className += ' done '; },
      blurSize: 20,
      event: 'click'
    }, opt);

    opt.imgs = [].slice.call(document.querySelectorAll(opt.imgSQuery));

    // skip if no matched img
    if (!opt.imgs.length) { return; }

    if (typeof opt.callback !== 'function') {
      opt.callback = false;
    }

    // append svg filter
    let inlineSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">
      <def>
        <filter id="lazy-blur-filter">
          <feGaussianBlur stdDeviation="${opt.blurSize}"></feGaussianBlur>
        </filter>
      </def>
    </svg>
    <style>
      ${opt.filterSelector} {
        -webkit-filter: url("#lazy-blur-filter");
                filter: url("#lazy-blur-filter");
      }
    </style>`;

    document.body.appendChild((() => {
      let newEl = document.createElement('div');
      newEl.innerHTML = inlineSvg;
      return newEl;
    })());

    let appendSrcImg = (imgS) => {
      let imgL = new Image();
      if (this.options.callback) {
        imgL.onload = () => {
          this.options.callback(imgS);
        };
      }
      imgL.className = opt.imgLClass;
      imgL.src = this.options.getSrc(imgS);
      imgS.parentNode.insertBefore(imgL, imgS.nextSibling);
    };

    if (opt.event === 'click' || opt.event === 'mouseover') {
      opt.imgs.map(img => {
        img.addEventListener(opt.event, () => appendSrcImg(img));
      });
    }

    this.options = opt;
  }

}
