# cheatermind

MasterMind clone where you are never lucky.

That is, the computer AI will stay consistent with whatever it has already said about your guesses, but cheat by not deciding on the final code until it has no other choice.

For a simplest example, pretend you're playing with one slot and two colours.  This is the equivalent of a coin toss.  Whatever you guess first will turn out not to be the right answer, because as soon as you guess it, the AI will cheat and make it the other one.  So it will always take you two guesses.

The question is, how well can you do, given that you're cursed with such bad luck?  What's the minimum worst case scenario?

## playing

First, if you do not have yarn installed:

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
