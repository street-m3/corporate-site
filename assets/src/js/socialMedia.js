document.addEventListener('DOMContentLoaded', () => {
    new SocialMedia(
        document.querySelector('.js-snsIcon-Component'), {
            facebook: true,
            twitter: true,
        }
    );
});

class SocialMedia {
    /**
     * 
     * @constructor SocialMedia
     * @param {string} root JSで生成したHTMLを格納するコンテナーのクラス名を設定します。 
     * @param {boolean} options 使用するSocialMediaをBooleanで有効化させます。(初期値はfalse)
     * @returns 
     */
    constructor(root, options) {
        this.root = root;
        if (!this.root) return;

        this.defaultOptions = {
            popup: true,
            facebook: false,
            twitter: false,
            line: false,
            hatena: false,
            pocket: false,
            instagram: false,
            youtube: false,
            pinterest: false,
        };
        // parameter, defaultOptions/options marged.
        this.options = Object.assign(this.defaultOptions, options);
        
        /**
         * this.href Object that stores the URL of the SNS
         * currentHref Get the current URL.
         * currentTitle Get the current page title.
         * currentImage Set the image to be displayed when it is shared. The default setting is to display the OGP.
         */
        const currentHref = location.href;
        const currentTitle = document.title;
        const currentImage = document.querySelector('meta[property="og:image"]');
        this.href = {
            facebook: `https://www.facebook.com/share.php?u=${encodeURIComponent(currentHref)}`,
            twitter: `https://twitter.com/share?url=${encodeURIComponent(currentHref)}&text=${encodeURIComponent(currentTitle)}`,
            line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentHref)}`,
            hatena: `https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(currentHref)}&btitle=${encodeURIComponent(currentTitle)}`,
            pocket: `https://getpocket.com/edit?url=${encodeURIComponent(currentHref)}&title=${encodeURIComponent(currentTitle)}`,
            instagram: `https://www.instagram.com/instagram/`,
            youtube: `https://www.youtube.com/user/YouTubeJapan/channels`,
            pinterest: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(currentHref)}&media=${encodeURIComponent(currentImage)}&description=${encodeURIComponent(currentTitle)}`,
        }

        /**
         * SVGのパスを40x40サイズで用意します。
         * 追加で必要なパスがある場合は、サービス名の後ろに番号を振ります。
         * 例: facebook:'...', facebook2:'...'
         */
        this.paths = {
            facebook: 'M40,20c0,-11.046 -8.954,-20 -20,-20c-11.046,-0 -20,8.954 -20,20c0,9.983 7.314,18.257 16.875,19.757l0,-13.976l-5.078,0l-0,-5.781l5.078,0l0,-4.406c0,-5.013 2.986,-7.781 7.554,-7.781c2.188,-0 4.477,0.39 4.477,0.39l0,4.922l-2.522,0c-2.484,0 -3.259,1.542 -3.259,3.123l0,3.752l5.547,0l-0.887,5.781l-4.66,0l-0,13.976c9.561,-1.5 16.875,-9.774 16.875,-19.757',
            facebook2: 'M27.785,25.781l0.887,-5.781l-5.547,0l-0,-3.752c-0,-1.581 0.775,-3.123 3.259,-3.123l2.522,0l0,-4.922c0,0 -2.289,-0.39 -4.477,-0.39c-4.568,-0 -7.554,2.768 -7.554,7.781l0,4.406l-5.078,0l-0,5.781l5.078,0l0,13.976c1.034,0.162 2.079,0.243 3.125,0.243c1.063,-0 2.107,-0.083 3.125,-0.243l-0,-13.976l4.66,0',
            twitter: 'M 35.886719 11.851562 C 35.914062 12.207031 35.914062 12.5625 35.914062 12.917969 C 35.914062 23.757812 27.664062 36.242188 12.589844 36.242188 C 7.945312 36.242188 3.628906 34.898438 0 32.5625 C 0.660156 32.640625 1.292969 32.664062 1.980469 32.664062 C 5.8125 32.664062 9.339844 31.371094 12.15625 29.164062 C 8.554688 29.085938 5.53125 26.726562 4.492188 23.476562 C 5 23.554688 5.507812 23.605469 6.039062 23.605469 C 6.777344 23.605469 7.511719 23.503906 8.199219 23.324219 C 4.441406 22.5625 1.625 19.265625 1.625 15.277344 L 1.625 15.179688 C 2.714844 15.785156 3.984375 16.167969 5.328125 16.21875 C 3.121094 14.746094 1.675781 12.234375 1.675781 9.390625 C 1.675781 7.867188 2.082031 6.472656 2.792969 5.253906 C 6.828125 10.226562 12.894531 13.476562 19.695312 13.832031 C 19.570312 13.222656 19.492188 12.589844 19.492188 11.953125 C 19.492188 7.4375 23.148438 3.757812 27.691406 3.757812 C 30.050781 3.757812 32.183594 4.746094 33.679688 6.34375 C 35.53125 5.988281 37.308594 5.304688 38.882812 4.367188 C 38.273438 6.269531 36.980469 7.867188 35.277344 8.882812 C 36.929688 8.707031 38.527344 8.25 40 7.613281 C 38.882812 9.238281 37.488281 10.683594 35.886719 11.851562 Z M 35.886719 11.851562',
            line: 'M 24.292969 15.375 L 24.292969 21.722656 C 24.292969 21.882812 24.167969 22.007812 24.007812 22.007812 L 22.992188 22.007812 C 22.890625 22.007812 22.804688 21.957031 22.761719 21.894531 L 19.847656 17.964844 L 19.847656 21.730469 C 19.847656 21.894531 19.726562 22.019531 19.5625 22.019531 L 18.542969 22.019531 C 18.386719 22.019531 18.261719 21.894531 18.261719 21.730469 L 18.261719 15.382812 C 18.261719 15.21875 18.386719 15.097656 18.542969 15.097656 L 19.554688 15.097656 C 19.644531 15.097656 19.738281 15.144531 19.785156 15.21875 L 22.699219 19.148438 L 22.699219 15.382812 C 22.699219 15.21875 22.824219 15.097656 22.980469 15.097656 L 24 15.097656 C 24.160156 15.089844 24.292969 15.21875 24.292969 15.375 Z M 16.972656 15.089844 L 15.957031 15.089844 C 15.796875 15.089844 15.671875 15.214844 15.671875 15.375 L 15.671875 21.722656 C 15.671875 21.882812 15.796875 22.007812 15.957031 22.007812 L 16.972656 22.007812 C 17.132812 22.007812 17.257812 21.882812 17.257812 21.722656 L 17.257812 15.375 C 17.257812 15.21875 17.132812 15.089844 16.972656 15.089844 Z M 14.519531 20.410156 L 11.742188 20.410156 L 11.742188 15.375 C 11.742188 15.214844 11.617188 15.089844 11.457031 15.089844 L 10.4375 15.089844 C 10.277344 15.089844 10.152344 15.214844 10.152344 15.375 L 10.152344 21.722656 C 10.152344 21.804688 10.179688 21.867188 10.234375 21.917969 C 10.289062 21.964844 10.347656 22 10.425781 22 L 14.511719 22 C 14.671875 22 14.792969 21.875 14.792969 21.714844 L 14.792969 20.695312 C 14.792969 20.542969 14.671875 20.410156 14.519531 20.410156 Z M 29.652344 15.089844 L 25.570312 15.089844 C 25.417969 15.089844 25.285156 15.214844 25.285156 15.375 L 25.285156 21.722656 C 25.285156 21.875 25.410156 22.007812 25.570312 22.007812 L 29.652344 22.007812 C 29.8125 22.007812 29.9375 21.882812 29.9375 21.722656 L 29.9375 20.707031 C 29.9375 20.542969 29.8125 20.417969 29.652344 20.417969 L 26.875 20.417969 L 26.875 19.347656 L 29.652344 19.347656 C 29.8125 19.347656 29.9375 19.222656 29.9375 19.058594 L 29.9375 18.035156 C 29.9375 17.875 29.8125 17.75 29.652344 17.75 L 26.875 17.75 L 26.875 16.675781 L 29.652344 16.675781 C 29.8125 16.675781 29.9375 16.550781 29.9375 16.394531 L 29.9375 15.375 C 29.929688 15.222656 29.800781 15.089844 29.652344 15.089844 Z M 40 7.292969 L 40 32.769531 C 39.992188 36.765625 36.714844 40.007812 32.707031 40 L 7.230469 40 C 3.234375 39.992188 -0.0078125 36.703125 0 32.707031 L 0 7.230469 C 0.0078125 3.234375 3.296875 -0.0078125 7.292969 0 L 32.769531 0 C 36.765625 0.0078125 40.007812 3.285156 40 7.292969 Z M 34.5 18.242188 C 34.5 11.722656 27.964844 6.421875 19.9375 6.421875 C 11.910156 6.421875 5.375 11.722656 5.375 18.242188 C 5.375 24.078125 10.554688 28.976562 17.554688 29.902344 C 19.257812 30.269531 19.058594 30.894531 18.679688 33.1875 C 18.617188 33.550781 18.386719 34.625 19.9375 33.976562 C 21.492188 33.324219 28.324219 29.035156 31.382812 25.515625 C 33.488281 23.195312 34.5 20.847656 34.5 18.242188 Z M 34.5 18.242188',
            hatena: 'M 4.761719 0 C 2.132812 0 0 2.132812 0 4.761719 L 0 35.238281 C 0 37.867188 2.132812 40 4.761719 40 L 35.238281 40 C 37.867188 40 40 37.867188 40 35.238281 L 40 4.761719 C 40 2.132812 37.867188 0 35.238281 0 Z M 10.421875 11.429688 L 18.546875 11.429688 C 21.019531 11.429688 23.019531 13.230469 23.019531 15.457031 C 23.019531 17.265625 21.675781 18.78125 19.847656 19.285156 C 22.097656 19.664062 23.808594 21.582031 23.808594 23.898438 C 23.808594 26.476562 21.664062 28.570312 19.027344 28.570312 L 10.421875 28.570312 Z M 25.652344 11.429688 L 29.523438 11.429688 L 29.523438 22.855469 L 25.652344 22.855469 Z M 14.484375 15.191406 L 14.484375 18.664062 L 16.78125 18.664062 C 17.773438 18.664062 18.582031 17.882812 18.582031 16.910156 C 18.582031 16.019531 17.875 15.285156 16.972656 15.191406 Z M 14.484375 21.714844 L 14.484375 25.535156 L 17.34375 25.535156 C 18.429688 25.535156 19.300781 24.679688 19.300781 23.628906 C 19.300781 22.570312 18.429688 21.714844 17.34375 21.714844 Z M 27.589844 24.761719 C 28.65625 24.761719 29.523438 25.617188 29.523438 26.667969 C 29.523438 27.714844 28.65625 28.570312 27.589844 28.570312 C 26.523438 28.570312 25.652344 27.714844 25.652344 26.667969 C 25.652344 25.617188 26.523438 24.761719 27.589844 24.761719 Z M 27.589844 24.761719',
            pocket: 'M 36.394531 3.125 L 3.625 3.125 C 1.652344 3.125 0 4.75 0 6.695312 L 0 18.578125 C 0 29.535156 8.902344 38.28125 20.019531 38.28125 C 31.089844 38.28125 40 29.535156 40 18.578125 L 40 6.695312 C 40 4.722656 38.417969 3.125 36.394531 3.125 Z M 21.929688 26.722656 C 20.820312 27.761719 19.125 27.699219 18.144531 26.722656 C 7.992188 17.152344 7.882812 17.484375 7.882812 15.894531 C 7.882812 14.410156 9.117188 13.199219 10.625 13.199219 C 12.144531 13.199219 12.0625 13.53125 20.019531 21.046875 C 28.105469 13.410156 27.929688 13.199219 29.4375 13.199219 C 30.945312 13.199219 32.179688 14.410156 32.179688 15.894531 C 32.179688 17.460938 31.917969 17.273438 21.929688 26.722656 Z M 21.929688 26.722656',
            pinterest: 'M 40 20 C 40 31.046875 31.046875 40 20 40 C 17.933594 40 15.953125 39.683594 14.082031 39.105469 C 14.894531 37.773438 16.113281 35.597656 16.566406 33.863281 C 16.804688 32.925781 17.804688 29.105469 17.804688 29.105469 C 18.460938 30.347656 20.363281 31.402344 22.386719 31.402344 C 28.417969 31.402344 32.765625 25.855469 32.765625 18.960938 C 32.765625 12.355469 27.371094 7.410156 20.433594 7.410156 C 11.804688 7.410156 7.21875 13.203125 7.21875 19.515625 C 7.21875 22.453125 8.78125 26.105469 11.273438 27.265625 C 11.652344 27.445312 11.855469 27.363281 11.945312 27 C 12.007812 26.726562 12.347656 25.363281 12.5 24.734375 C 12.546875 24.53125 12.523438 24.355469 12.363281 24.160156 C 11.546875 23.152344 10.886719 21.316406 10.886719 19.597656 C 10.886719 15.183594 14.226562 10.917969 19.917969 10.917969 C 24.832031 10.917969 28.273438 14.265625 28.273438 19.054688 C 28.273438 24.46875 25.539062 28.21875 21.984375 28.21875 C 20.023438 28.21875 18.546875 26.597656 19.023438 24.605469 C 19.589844 22.226562 20.675781 19.660156 20.675781 17.945312 C 20.675781 16.410156 19.855469 15.128906 18.144531 15.128906 C 16.136719 15.128906 14.523438 17.203125 14.523438 19.984375 C 14.523438 21.757812 15.121094 22.953125 15.121094 22.953125 C 15.121094 22.953125 13.144531 31.324219 12.78125 32.886719 C 12.378906 34.613281 12.539062 37.046875 12.710938 38.628906 C 5.273438 35.71875 0 28.476562 0 20 C 0 8.953125 8.953125 0 20 0 C 31.046875 0 40 8.953125 40 20 Z M 40 20',
            instagram: 'M 20.008,9.891c-5.676,-0 -10.258,4.511 -10.258,10.101c0,5.59 4.582,10.098 10.258,10.098c5.68,-0 10.262,-4.508 10.262,-10.098c-0,-5.59 -4.582,-10.101 -10.262,-10.101Zm-0,16.668c-3.668,-0 -6.668,-2.946 -6.668,-6.567c-0,-3.621 2.992,-6.566 6.668,-6.566c3.68,-0 6.672,2.945 6.672,6.566c-0,3.621 -3,6.567 -6.672,6.567Zm13.074,-17.079c0,1.309 -1.074,2.356 -2.395,2.356c-1.332,-0 -2.394,-1.055 -2.394,-2.356c-0,-1.3 1.074,-2.355 2.395,-2.355c1.32,-0 2.394,1.055 2.394,2.355Zm6.793,2.391c-0.152,-3.156 -0.883,-5.949 -3.23,-8.254c-2.34,-2.305 -5.18,-3.023 -8.387,-3.183c-3.301,-0.184 -13.203,-0.184 -16.508,-0c-3.195,0.152 -6.035,0.871 -8.383,3.175c-2.347,2.301 -3.074,5.098 -3.234,8.25c-0.188,3.254 -0.188,13 -0,16.254c0.152,3.153 0.887,5.949 3.234,8.254c2.348,2.301 5.176,3.024 8.383,3.18c3.305,0.183 13.207,0.183 16.508,-0c3.207,-0.149 6.047,-0.871 8.387,-3.18c2.335,-2.305 3.07,-5.097 3.23,-8.254c0.188,-3.254 0.188,-12.992 0,-16.242Zm-4.27,19.731c-0.695,1.722 -2.042,3.05 -3.8,3.742c-2.637,1.031 -8.887,0.793 -11.797,0.793c-2.91,-0 -9.168,0.23 -11.793,-0.793c-1.75,-0.684 -3.098,-2.012 -3.805,-3.742c-1.043,-2.594 -0.805,-8.747 -0.805,-11.61c0,-2.867 -0.23,-9.027 0.805,-11.609c0.695,-1.723 2.047,-3.051 3.805,-3.746c2.633,-1.028 8.883,-0.789 11.793,-0.789c2.91,-0 9.172,-0.231 11.797,0.789c1.75,0.687 3.097,2.011 3.8,3.746c1.047,2.59 0.805,8.742 0.805,11.609c0,2.863 0.242,9.028 -0.805,11.61Z',
            youtube: 'M 39.167969 10.335938 C 38.707031 8.601562 37.351562 7.238281 35.632812 6.777344 C 32.511719 5.933594 20 5.933594 20 5.933594 C 20 5.933594 7.488281 5.933594 4.367188 6.777344 C 2.648438 7.238281 1.292969 8.601562 0.832031 10.335938 C -0.00390625 13.476562 -0.00390625 20.027344 -0.00390625 20.027344 C -0.00390625 20.027344 -0.00390625 26.582031 0.832031 29.722656 C 1.292969 31.453125 2.648438 32.761719 4.367188 33.222656 C 7.488281 34.066406 20 34.066406 20 34.066406 C 20 34.066406 32.511719 34.066406 35.632812 33.222656 C 37.351562 32.761719 38.707031 31.453125 39.167969 29.722656 C 40.003906 26.582031 40.003906 20.027344 40.003906 20.027344 C 40.003906 20.027344 40.003906 13.476562 39.167969 10.335938 Z M 15.90625 25.976562 L 15.90625 14.078125 L 26.363281 20.027344 Z M 15.90625 25.976562',
        }
        // Generate HTML list tags to store components.
        this.classPrefix = 'c-snsIcon-Component';
        this.snsList = document.createElement('ul');
        this.snsList.setAttribute('class', `${this.classPrefix}_List`);
        this.root.appendChild(this.snsList);

        this.init();
    }

    init() {
        if (this.options.facebook) this.renderComponent('facebook', 'Facebookでシェア');
        if (this.options.twitter) this.renderComponent('twitter', 'Twitterでシェア');
        if (this.options.line) this.renderComponent('line', 'LINEに送る');
        if (this.options.hatena) this.renderComponent('hatena', 'はてなブックマークに登録');
        if (this.options.pocket) this.renderComponent('pocket', 'Pocketに保存する');
        if (this.options.instagram) this.renderComponent('instagram', '公式instagram');
        if (this.options.youtube) this.renderComponent('youtube', '公式youtube');
        if (this.options.pinterest) this.renderComponent('pinterest', 'Pintarestに保存する');
        if (this.options.popup) this.popup();
    }

    /**
     * 
     * @param {String} name サービス名を文字列で設定します。
     * @param {String} label aira-labelの設定を文字列で設定します。
     */
    renderComponent(name, label) {
        const snsListItem = document.createElement('li');
        const snsListLink = document.createElement('a');
        snsListItem.setAttribute('class', `${this.classPrefix}_List-Item`);
        snsListLink.setAttribute('class', `${this.classPrefix}_Link -${name}`);
        snsListLink.setAttribute('href', this.href[name]);
        snsListLink.setAttribute('rel', 'nofollow noopener noreferrer');
        snsListLink.setAttribute('target', '_blank');
        snsListLink.setAttribute('aria-label', label);
        this.snsList.appendChild(snsListItem);
        snsListItem.appendChild(snsListLink);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const size = 40;
        svg.setAttribute('fill', 'none');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        svg.setAttribute('id', `snsIcon-Component-PathName:${name}`);
        svg.setAttribute('class', `${this.classPrefix}_Icon`);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-hidden', 'true');
        svg.appendChild(path);
        path.setAttribute('d', this.paths[name]);
        snsListLink.appendChild(svg);

        // 追加パーツ(path)が必要な場合は関数を呼び出す
        this._parts(name, 'facebook', svg, 2);
    }

    /**
     * 
     * @param {String} name renderComponent(name) 引数を設定します。
     * @param {String} service 比較対象となるSNSサービス名を文字列で渡します。
     * @param {String} parent renderComponent(svg) 引数を設定します。
     * @param {Number} num パーツの番号を付与します。
     */
    _parts(name, service, parent, num) {
        if (name == service) {
            const parts = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            parts.setAttribute('d', this.paths[`${service}${num}`]);
            parts.setAttribute('class', `${name}-parts-${num}`);
            parent.appendChild(parts);
        }

        return;
    }

    /**
     * Function for opening a popup window.
     * @returns
     */
    popup() {
        const snsLinks = this.root.querySelectorAll('a');
        snsLinks.forEach((element) => {
            element.addEventListener('click', (e) => {
                const target = e.currentTarget;
                e.preventDefault();
                const url = target.getAttribute('href');
                const popupSize = 'width=580,height=400,menubar=no,toolbar=no,scrollbars=yes';
                window.open(url, '', popupSize);
            });
        });

        return;
    }
}