export interface DigiSnippetConfig {
    /**
     * isReadOnly - boolean
     *
     * Default value is false. The try section will come when its true.
     */
    isReadOnly?: boolean;
    /**
     *
     * openInEditor => string;
     *
     * This is callback function. The content will return in this function when click button.
     */
    openInEditor?: any;
    /**
     * Button - you can customize the text and class.
     */
    button?: {
        /**
         * Label for the button.
         *
         * Default label is `Open in editor`
         */
        text?: string;
        /**
         * Button class.
         *
         * Note:- The default class nerve apply when pass this option.
         */
        class?: string;
        /**
         *
         * Default value is false.
         *
         * Note:- Hide the open in editor button.
         *
         */
        hide: boolean;
    };
    /**
     * This left side label.
     *
     * Default text is `Try it yourself`
     */
    tryText?: string;
}
