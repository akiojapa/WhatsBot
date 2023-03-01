import { Client } from "../api/Client";
import { Message } from "../api/model/message";
export type MessagePreProcessor = (message: Message, client?: Client) => Promise<Message>;
/**
 * An object that contains all available [[PREPROCESSORS]].
 *
 * [Check out the processor code here](https://github.com/open-wa/wa-automate-nodejs/blob/master/src/structures/preProcessors.ts)
 */
export declare const MessagePreprocessors: {
    [processorName: string]: MessagePreProcessor;
};
/**
 * A set of easy to use, built-in message processors.
 *
 * [Check out the processor code here](https://github.com/open-wa/wa-automate-nodejs/blob/master/src/structures/preProcessors.ts)
 *
 */
export declare enum PREPROCESSORS {
    /**
     * This preprocessor scrubs `body` and `content` from media messages.
     * This would be useful if you want to reduce the message object size because neither of these values represent the actual file, only the thumbnail.
     */
    SCRUB = "SCRUB",
    /**
     * A preprocessor that limits the amount of base64 data is present in the message object by removing duplication of `body` in `content` by replacing `content` with `""`.
     */
    BODY_ONLY = "BODY_ONLY",
    /**
     * Replaces the media thumbnail base64 in `body` with the actual file's DataURL.
     */
    AUTO_DECRYPT = "AUTO_DECRYPT",
    /**
     * Automatically saves the file in a folder named `/media` relative to the process working directory.
     *
     * PLEASE NOTE, YOU WILL NEED TO MANUALLY CLEAR THIS FOLDER!!!
     */
    AUTO_DECRYPT_SAVE = "AUTO_DECRYPT_SAVE",
    /**
     *
     * Uploads file to a cloud storage provider (GCP/AWS for now).
     *
     * If this preprocessor is set then you have to also set [`cloudUploadOptions`](https://docs.openwa.dev/interfaces/api_model_config.ConfigObject.html#cloudUploadOptions) in the config.
     *
     */
    UPLOAD_CLOUD = "UPLOAD_CLOUD"
}
/**
 * The actual type for [config.messagePreprocessor](/docs/api/interfaces/api_model_config.ConfigObject#messagepreprocessor)
 */
export type MPConfigType = PREPROCESSORS | MessagePreProcessor | (PREPROCESSORS | MessagePreProcessor)[];
