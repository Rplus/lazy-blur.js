/* global Image */
class LazyBlur {
  /**
   * @param  {String}       imgSQuery
   *         small imgs' className or imgs' DOM array
   *         default: `.lazy-blur__imgS`
   *
   * @param  {Function}     getImgLSrc
   *         function for getting imgL source url
   *         default: `function (imgS) { return imgS.getAttribute('data-src'); }`
   *
   * @param  {String}       eventType
   *         event of trigger load images
   *         'click', 'mouseenter', 'scroll' (default)
   *
   * @param  {Number}       scrollThreshold
   *         distance of scroll threshold (buffer), unit: px
   *         default: 50
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
   * @param  {Function}     onLoad
   *         after imgL loaded
   *         default: `addClass('done')` for imgS' parent
   */

  constructor (opt = {}) {
    opt.imgSQuery = opt.imgSQuery || '.lazy-blur__imgS';
    opt = Object.assign({
      imgLClass: 'lazy-blur__imgL',
      filterSelector: `html.svg *:not(.done) > ${opt.imgSQuery}`,
      getImgLSrc: (imgS) => { return imgS.getAttribute('data-src'); },
      onLoad: (imgS) => { imgS.parentElement.className += ' done '; },
      blurSize: 20,
      scrollThreshold: 50,
      eventType: 'scroll'
    }, opt);

    opt.imgs = [].slice.call(document.querySelectorAll(opt.imgSQuery));

    // skip if no matched img
    if (!opt.imgs.length) { return; }

    if (typeof opt.onLoad !== 'function') {
      opt.onLoad = false;
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
      if (opt.onLoad) {
        imgL.onload = () => {
          opt.onLoad(imgS);
        };
      }
      imgL.className = opt.imgLClass;
      imgL.src = opt.getImgLSrc(imgS);
      imgS.parentNode.insertBefore(imgL, imgS.nextSibling);
    };

    // events for loading img
    if (opt.eventType === 'click' || opt.eventType === 'mouseenter') {
      opt.imgs.map(img => {
        img.addEventListener(opt.eventType, () => appendSrcImg(img));
      });
    } else if (opt.eventType === 'scroll') {
      let getImgPos = () => {
        // return if all lazy-blur images loaded
        if (opt.imgsWithPos && !opt.imgsWithPos.length) { return; }

        opt.imgsWithPos = opt.imgs.map(img => {
          let _rect = img.getBoundingClientRect();
          let _offsetY = window.pageYOffset;
          return {
            imgEl: img,
            top: _rect.top + _offsetY,
            bottom: _rect.bottom + _offsetY
          };
        });
      };

      let detectImgsAreInViewport = () => {
        // return if all imgs loaded
        if (!opt.imgsWithPos.length) { return; }

        let _offsetY = window.pageYOffset;
        let _vpTop = _offsetY - opt.scrollThreshold;
        let _vpBottom = _offsetY + window.innerHeight + opt.scrollThreshold;

        opt.imgsWithPos = opt.imgsWithPos.filter((imgData, idx) => {
          let isInVp = (imgData.bottom < _vpBottom && imgData.bottom > _vpTop) ||
                       (imgData.top > _vpTop && imgData.top < _vpBottom);

          if (isInVp) {
            appendSrcImg(imgData.imgEl);
          }

          return !isInVp;
        });
      };

      getImgPos();
      detectImgsAreInViewport();

      window.addEventListener('scroll', () => {
        detectImgsAreInViewport();
      });

      window.addEventListener('resize', () => {
        getImgPos();
        detectImgsAreInViewport();
      });
    }
  }

}
