export const actionScriptContent =
`
module.exports = async (page, scenario, vp) => {
  await require('./onReady')(page, scenario, vp);

  const actions = scenario.actions;

  if (Array.isArray(actions)) {
    for (let i = 0; i < actions.length; i++) {
      const { type, selector, key, text, delay,
        coordinate } = actions[i];
      switch (type) {
        case 'click':
          await page.waitForSelector(selector);
          await page.click(selector);
          break;
        case 'focus':
          await page.waitForSelector(selector);
          await page.focus(selector);
          break;
        case 'hover':
          await page.waitForSelector(selector);
          await page.hover(selector);
          break;
        case 'waitForTimeout':
          await page.waitForTimeout(delay);
          break;
        case 'waitForSelector':
          await page.waitForSelector(selector);
          break;
        case 'pressKey':
          await page.keyboard.press(key);
          break;
        case 'type':
          await page.keyboard.type(text);
          break;
        case 'mouseMove':
          await page.mouse.move(coordinate.x, coordinate.y);
          break;
      }
    }
  }
};
`;
