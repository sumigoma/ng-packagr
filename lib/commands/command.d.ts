/**
 * Common call signature for a command
 *
 * @stable
 */
export interface Command<Arguments, Result> {
    (args?: Arguments): Result | Promise<Result>;
}
/** @stable */
export declare function execute<A, R>(command: Command<A, R>, args?: A): Promise<R>;
