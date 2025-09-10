export default class ButtonsContainer extends Phaser.GameObjects.Container {
    constructor(scene, eventManager, x, y, buttonImages, gap, isRowOriented = true, scaleOffset, defaultOpacity) {
        super(scene, x, y);
        this.eventManager = eventManager;
        this.scene.add.existing(this);
        this.isEnabled = true;
        this.buttonImages = buttonImages;
        this.gap = gap;
        this.x = x;
        this.y = y;
        this.defaultOpacity = defaultOpacity;
        this.scaleOffset = scaleOffset;
        this.offsetPadding = (buttonImages.length * (gap/2));
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'button-container';
        this.isRowOriented = isRowOriented;
        this.onClickCallback = null;
        this.onUnClickCallback = null;
        this.onHoverEnterCallback = null;
        this.onHoverExitCallback = null;
        this.currentClickedBtn = null;

        this.draw();
        this.disable();

    }

    draw() {
        if(this.isRowOriented) {
            this.containerElement.style.padding = `35px ${this.offsetPadding}px`;
            for(let i = 0; i < this.buttonImages.length; i++) {
                const btn = this.scene.add
                .image(i * this.gap, 0, this.buttonImages[i])
                .setScale(this.scaleOffset)
                .setInteractive({cursor: 'pointer'})
                .setDepth(3);

                btn.alpha = this.defaultOpacity;
                btn.index = i;
                this.add(btn);

                btn.on('pointerdown', () => {
                    this.onClick(btn);
                }, this)

                btn.on('pointerup', () => {
                    this.onUnClick(btn);
                }, this)

                btn.on('pointerover', () => {
                    this.onHoverEnter(btn);
                }, this)

                btn.on('pointerout', () => {
                    this.onHoverExit(btn);
                }, this)

                this.containerElement.append(document.createElement('div'));
                this.scene.add.dom(this.x + (this.gap/2), this.y, this.containerElement);
            }
        }
        else {
            for(let i = 0; i < this.buttonImages.length; i++) {
                this.containerElement.style.padding = `${this.offsetPadding + (30 * this.scaleOffset)}px 
                                                       ${this.offsetPadding + (40 * this.scaleOffset)}px`;
                const btn = this.scene.add
                .image(0, i * (this.gap+30), this.buttonImages[i])
                .setScale(this.scaleOffset)
                .setInteractive({cursor: 'pointer'})
                .setDepth(3);

                btn.index = i;

                btn.alpha = this.defaultOpacity;
                this.add(btn);

                btn.on('pointerdown', () => {
                    this.onClick(btn);
                }, this)

                btn.on('pointerup', () => {
                    this.onUnClick(btn);
                }, this)

                btn.on('pointerover', () => {
                    this.onHoverEnter(btn);
                }, this)

                btn.on('pointerout', () => {
                    this.onHoverExit(btn);
                }, this)

                this.containerElement.append(document.createElement('div'));
                this.scene.add.dom(this.x, this.y + ((this.gap)/2)+20, this.containerElement);
            }
        }
    }

    setOnClickCallback(onClickCallback) {
        this.onClickCallback = onClickCallback;
    }

    setOnUnClickCallback(onUnClickCallback) {
        this.onUnClickCallback = onUnClickCallback;
    }

    setOnHoverEnterCallback(onHoverEnterCallback) {
        this.onHoverEnterCallback = onHoverEnterCallback;
    }

    setOnHoverExitCallback(onHoverExitCallback) {
        this.onHoverExitCallback = onHoverExitCallback;
    }

    onClick(btn) {
        if(this.onClickCallback === null) {
            const oldIndex = this.eventManager.CHANGE_FORMAT(btn.index);
            if(oldIndex !== btn.index) {
                this.getAt(oldIndex).alpha = this.defaultOpacity;
            }
            btn.alpha = 1.0;
        }
        else {
            this.currentClicked = btn;
            this.onClickCallback(btn);
        }
    }

    onUnClick(btn) {
        if(this.onUnClickCallback !== null) {
            this.onUnClickCallback(btn);
        }
    }

    onHoverEnter(btn) {
        if(this.onHoverEnterCallback !== null) {
            this.onHoverEnterCallback(btn);
        }
    }

    onHoverExit(btn) {
        if(this.onHoverExitCallback !== null) {
            this.onHoverExitCallback(btn);
        }
    }


    enable() {
        if(!this.isEnabled) {
            for(let i = 0; i < this.containerElement.children.length; i++) {
                this.getAt(i).alpha = this.defaultOpacity;
            }
            this.containerElement.classList.remove("hide-element");
            this.isEnabled = true;
        }
    }

    disable() {
        if(this.isEnabled) {
            for(let i = 0; i < this.containerElement.children.length; i++) {
                this.getAt(i).alpha = 0;
            }
            this.containerElement.classList.add("hide-element");
            this.isEnabled = false;
        }
    }
}