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
   * @param  {Function}     callback
   *         after imgL loaded
   *         default: `addClass('done')` for imgS' parent
   */

  constructor (opt = {}) {
    opt = Object.assign({
      imgSQuery: '.lazy-blur__imgS',
      imgLClass: 'lazy-blur__imgL',
      getSrc: (imgS) => { return imgS.getAttribute('data-src'); },
      callback: (imgS) => { imgS.parentElement.className += ' done '; },
      event: 'click'
    }, opt);

    opt.imgs = [].slice.call(document.querySelectorAll(opt.imgSQuery));

    if (typeof opt.callback !== 'function') {
      opt.callback = false;
    }

    // skip if no matched img
    if (!opt.imgs.length) { return; }

    if (opt.event === 'click' || opt.event === 'mouseover') {
      opt.imgs.map(img => {
        img.addEventListener(opt.event, () => this.appendSrcImg(img));
      });
    }

    this.options = opt;
  }

  appendSrcImg (imgS) {
    let imgL = new Image();
    imgL.onload = () => {
      imgS.src = imgL.src;
      if (this.options.callback) {
        this.options.callback(imgS);
      }
    };
    imgL.src = this.options.getSrc(imgS);
  }
}
