const nextIndexInArray = (arr, el) => {
  const idx = arr.indexOf(el);
  return (idx < 0 || idx >= arr.length) ? 0 : idx + 1;
}

export class Clock {
    static get sizes () {
        return [2, 3, 4, 5, 6, 8, 10, 12];
    }

    static get themes () {
        return this._themes;
    }

    constructor ({ theme, size, progress } = {}) {
        this.themesPromise = FilePicker.browse("data", "modules/progress-clocks/themes").then(data => {
            let tempDirs = data.dirs;
            let newDirs = [];
            let newPaths = [];
            let baseDirCheck = false;
            tempDirs.forEach((dirItem) => {
                let newDirItem = dirItem.replace("modules/progress-clocks/themes/","");
                if (dirItem.startsWith("modules/progress-clocks/themes/")) {
                    newDirs.push(newDirItem);
                    newPaths.push(dirItem);
                    baseDirCheck = true;
                }
            });
            if (!(baseDirCheck)) {
                console.error("Failed.")
            };
            this._themes = newDirs;
            this._themePaths = tempDirs;
        }).catch(err => {
            console.error(err)
        });
        const isSupportedSize = size && Clock.sizes.indexOf(parseInt(size)) >= 0;
        this._size = isSupportedSize ? parseInt(size) : Clock.sizes[0];

        const p = (!progress || progress < 0) ? 0 : progress < this._size ? progress : this._size;
        this._progress = p || 0;

        this._theme = theme || this._themes?.[0] || "wallflower_green";
    }

    get theme () {
        return this._theme;
    }

  get size () {
    return this._size;
  }

  get progress () {
    return this._progress;
  }

  get image () {
    return { 
      width: 350,
      height: 350
    };
  }

  get flags () {
    return {
      clocks: {
        theme: this._theme,
        size: this._size,
        progress: this._progress
      }
    };
  }

  cycleSize () {
    return new Clock({
      theme: this.theme,
      size: Clock.sizes[nextIndexInArray(Clock.sizes, this.size)],
      progress: this.progress
    });
  }

  increment () {
    const old = this;
    return new Clock({
      theme: old.theme,
      size: old.size,
      progress: old.progress + 1
    });
  }

  decrement () {
    const old = this;
    return new Clock({
      theme: old.theme,
      size: old.size,
      progress: old.progress - 1
    });
  }

  isEqual (clock) {
    return clock
      && clock._progress === this._progress
      && clock._size === this._size
      && clock._theme === this._theme;
  }

  toString () {
    return `${this._progress}/${this._size} • ${this._theme}`;
  }
}
