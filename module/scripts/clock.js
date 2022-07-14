const nextIndexInArray = (arr, el) => {
    const idx = arr.indexOf(el);
    return (idx < 0 || idx >= arr.length) ? 0 : idx + 1;
}

export class Clock {
    static sizes = [
        2, 3, 4, 5, 6, 8, 10, 12
    ];

    static image = {
        width: 350,
        height: 350
    };

    static themePath = 'modules/progress-clocks/themes';

    static themes = {
        gms_red: `${Clock.themePath}/gms_red`,
        gms_red_grey: `${Clock.themePath}/gms_red_grey`,
        wallflower_green: `${Clock.themePath}/wallflower_green`,
        wallflower_green_grey: `${Clock.themePath}/wallflower_green_grey`
    };

    constructor ({ theme, size, progress } = {}) {
        const isSupportedSize = size && Clock.sizes.indexOf(parseInt(size)) >= 0;

        this.size = isSupportedSize ? parseInt(size) : Clock.sizes[0];

        if (!progress || progress < 0) {
            this.progress = 0;
        } else if (progress > size) {
            this.progress = this.size;
        } else {
            this.progress = progress;
        }

        this.theme = theme || 'wallflower_green';
    }

    get flags () {
        return {
            clocks: {
                theme: this.theme,
                size: this.size,
                progress: this.progress
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
            && clock.progress === this.progress
            && clock.size === this.size
            && clock.theme === this.theme;
    }

    toString () {
        return `${this.progress}/${this.size} • ${this.theme}`;
    }
}
