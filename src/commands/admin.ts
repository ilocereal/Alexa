import { merge, Observable, of, pipe } from "rxjs";
import { catchError, flatMap, map, partition, share } from "rxjs/operators";
import { inspect } from "util";
import { createCommand } from "../command";
import { ArgType } from "../types/parser";
import { Command, Context } from "../types/types";
import { postToHastebin, removeToken, wrapCode } from "../utils";

const canPost = (input: string) =>
  input.length < 1950;

const format = (input: any) =>
  typeof input === 'object'
    ? JSON.stringify(input, null, 2)
    : input;

const splitPostable = partition(canPost);

const customEval = createCommand({
  names: ['eval'],
  description: "Evals a thingymabob",
  hidden: true,
  expects: [ArgType.Phrase],
  canRun: (ctx: Context) => ctx.message.author.id === process.env.OWNER_ID,
  run: async (ctx: Context, [code]: [string]) => {
    const wrap = (res: string) => wrapCode(res, 'json');
    const evalResult$ = of(code).pipe(
      /* tslint:disable */
      map(input => eval(input)),
      /* tslint:enable */
      map(format),
      map(removeToken),
      map(wrap),
      catchError(error => of(error.toString()).pipe(
        map(wrap)
      )),
      share()
    );

    const [postable$, unpostable$] = splitPostable(evalResult$);

    const uploaded$ = unpostable$.pipe(
      flatMap(postToHastebin),
      map(content =>
        `I uploaded the response on hastebin because it was too big\n${content}`)
    );

    merge(uploaded$, postable$).subscribe(response =>
      ctx.message.channel.send(response)
    );
  }
});


export default { customEval };