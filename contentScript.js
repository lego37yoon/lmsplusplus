(() => {
  window.addEventListener('load', () => {
    // get firefox settings
    browser.storage.sync.get(['session', 'playback', 'course'], ({
      session,
      playback,
      course,
    }) => {
      const tools = new Tools({ session, playback, course });

      if(!!session) {
        tools.maintainSession();
      }

      if (!!playback) {
        tools
          .videoBtnReplacement()
          .videoCompletion()
          .displayPlayback();
      }
    });
  });

  /**
   * lms tools
   */
  class Tools {
    /**
     * @param {Object} conf lms++ configuration
     */
    constructor(conf) {
      this.pageName = Tools.getPageName(window.location.href)[0];
      this.conf = conf;

      console.log('LMS Extension loaded! \'~^ (GitHub: https://git.io/JfiHe)');
    }

    /**
     * video button replacement
     */
    videoBtnReplacement() {
      if (this.pageName === 'video') {
        return this;
      }

      [...document.querySelectorAll('a')]
        .filter((el) => el.getAttribute('onclick') !== null && el.getAttribute('onclick').includes('https://lms.sch.ac.kr/mod/xncommons/viewer.php?'))
        .forEach((el) => {
          // get origin link
          const link = el.outerHTML.match(/window\.open\('(.+?)'/)[1];

          // replacement
          const rpel = document.createElement('a');
          rpel.innerText = el.textContent;
          rpel.href = '#';

          rpel.addEventListener('click', async (evt) => {
            evt.preventDefault();

            // get video link
            const videoLink = (await (await fetch(
              (await (await fetch(
                link
              )).text()).match(/\<iframe src="(.+?)"/)[1],
            )).text()).match(/xncommonsWin\.src.*?"(.+?)"/)[1];

            window.open(videoLink, '_blank');
          });

          el.parentElement.replaceChild(rpel, el);
        });

      return this;
    }

    /**
     * display and changeable playback-rate panel
     */
    displayPlayback() {
      if (this.pageName !== 'video') {
        return this;
      }

      // page update observer
      new MutationObserver(function() {
        if (document.querySelector('div#front-screen')) {
          // update panel style
          document.querySelector('div#play-controller').style.display = 'block';
          document.querySelector('div#play-controller div.vc-pctrl-playback-rate-setbox').style.display = 'block';

          // set playback-rate changeable
          const s = document.createElement('script');
          s.setAttribute('type', 'text/javascript');
          s.innerHTML = 'window.uniPlayerConfig.getUniPlayerSettingsData().usePlaybackRate = true;';
          document.getElementsByTagName('body')[0].appendChild(s);

          // playback panel is always displayed
          new MutationObserver(([{ target }]) => {
            target.style.display = 'block';
          }).observe(document.querySelector('div#play-controller div.vc-pctrl-playback-rate-setbox'), {
            attributes: true,
          });

          this.disconnect();
        }
      }).observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });

      return this;
    }

    /**
     * maintain session
     */
    maintainSession() {
      if (this.pageName === 'video') {
        return this;
      }

      // re-conn session each 30 seconds
      setInterval(() => {
        [
          'https://lms.sch.ac.kr/',
          'https://lms.sch.ac.kr/course/index.php',
        ].forEach((name) => fetch(name));
      }, 30000);

      return this;
    }

    /**
     * video completion
     */
    videoCompletion() {
      if (this.pageName !== 'video') {
        return this;
      }

      new MutationObserver(function() {
        if ( // waitting for player inited
          document.querySelector('div.vc-pctrl-play-progress')
          && !!document.querySelector('div.vc-pctrl-play-progress').style.width
        ) {
          // execute completion module script
          const s = document.createElement('script');
          s.setAttribute('type', 'text/javascript');

          s.innerHTML = `
            (() => {
              const duration = bcPlayController.getPlayController()._duration;

              play_time = duration;
              SeekWithUpdateCumulativeTime(duration);

              uniPlayer.getVCUniPlayerLayout()._eventTarget.fire(VCUniPlayerLayoutEvent.PLAYER_RESTART);
            })();
          `;
    
          document.getElementsByTagName('body')[0].appendChild(s);

          this.disconnect();
        }
      }).observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });

      return this;
    }

    /**
     * update course learning time
     * 
     * @param {Number} id course id
     */
    async updateCourseTime(id) {
      if (this.pageName === 'video') {
        return this;
      }

      // using attempt index = 65535
      const attempts = 65535;

      // get course tack id
      const trackId = (await (await fetch(`https://lms.sch.ac.kr/mod/xncommons/viewer.php?id=${id}`)).text())
        .match(/\"track\".*?([\d]+?.*?),/)[1].trim();

      // update
      await fetch('https://lms.sch.ac.kr/mod/xncommons/action.php', {
        method: 'post',
        mode: 'cors',
        credentials: 'include',
        referrer: 'https://lms.sch.ac.kr/mod/xncommons/viewer.php',
        referrerPolicy: 'no-referrer-when-downgrade',
        headers: {
          accept: '*/*',
          'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          pragma: 'no-cache',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: `type=track_for_onwindow&track=${trackId}&state=3&position=0&attempts=${attempts}&interval=60`,
      });

      return this;
    }

    /**
     * get current page name
     * 
     * @param {String} href raw location href
     * @return {[String]} matched names
     */
    static getPageName(href) {
      const patterns = [
        [/lms\.sch\.ac\.kr\/course\/view\.php/, 'courses'],
        [/commons\.sch\.ac\.kr\/em\/.*/, 'video'],
      ];
  
      return patterns
        .map(([r, name]) => href.match(r) !== null ? name : undefined)
        .filter(v => v !== undefined);
    }
  }
})();
