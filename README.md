# cheatermind

MasterMind clone where you are never lucky.

That is, the computer AI will stay consistent with whatever it has already said about your guesses, but it will cheat by not deciding on the final code until it has no other choice.

For a simplest example, pretend you're playing with one slot and two colours.  This is the equivalent of a coin toss.  Whatever you guess first will turn out not to be the right answer, because as soon as you guess it, the AI will cheat and pretend that the other one was the correct answer all along.  So it will always take you two guesses.

**The question is, how well can you do, given that you're cursed with such bad luck?**

Compare your minimum with a play-through that uses the "best automatic guess" feature.  :-)

## playing online

You can play a live demo at: https://ibwwg.itch.io/cheatermind

## playing locally

It's assumed you have Node, npm, and git installed.

You also need yarn installed globally.  If you do not have it:

```sh
npm install --global yarn
```

With yarn installed:

```sh
git clone https://github.com/IBwWG/cheatermind
cd cheatermind
yarn
npm run build
```

Then launch public/index.html in your browser.  The clickable dots set your current guess, and the arrow makes your current guess official, and grades it for you.

## tests

```sh
npm test
```

## questions of interest

1. What's the minimum number of moves for a given slot + colour configuration in this worst-case scenario?  Does the current implementation always produce it?
1. [Is it possible to come up with a formula for this?](http://math.stackexchange.com/questions/2182321/the-best-worst-case-scenario-in-mastermind)
1. How can the AI be made more memory-efficient, so as to scale better?