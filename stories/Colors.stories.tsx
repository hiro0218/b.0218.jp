/*
 Check if the stylesheet is internal or hosted on the current domain.
 If it isn't, attempting to access sheet.cssRules will throw a cross origin error.
 See https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet#Notes

 NOTE: One problem this could raise is hosting stylesheets on a CDN with a
 different domain. Those would be cross origin, so you can't access them.
*/
const isSameDomain = (styleSheet) => {
  // Internal style blocks won't have an href value
  if (!styleSheet.href) {
    return true;
  }

  return styleSheet.href.indexOf(window.location.origin) === 0;
};

/*
 Determine if the given rule is a CSSStyleRule
 See: https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants
*/
const isStyleRule = (rule) => rule.type === 1;

/**
 * Get all custom properties on a page
 * @return array<array[string, string]>
 * ex; [["--color-accent", "#b9f500"], ["--color-text", "#252525"], ...]
 */
const getCSSCustomPropIndex = () =>
  // styleSheets is array-like, so we convert it to an array.
  // Filter out any stylesheets not on this domain
  [...document.styleSheets].filter(isSameDomain).reduce(
    (finalArr, sheet) =>
      finalArr.concat(
        // cssRules is array-like, so we convert it to an array
        [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule: CSSStyleRule) => {
          const props = [...rule.style]
            .map((propName) => [propName.trim(), rule.style.getPropertyValue(propName).trim()])
            // Discard any props that don't start with "--". Custom props are required to.
            .filter(([propName]) => propName.indexOf('--') === 0);

          return [...propValArr, ...props];
        }, []),
      ),
    [],
  );

const cssCustomPropIndex = getCSSCustomPropIndex();

const Colors = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 175px))',
        gridGap: '1rem',
        marginBottom: '2.5rem',
      }}
    >
      {cssCustomPropIndex
        .filter(([prop, val]) => prop.includes('color') || val.includes('#'))
        .map(([prop, val], index) => {
          return (
            <div
              key={index}
              style={{
                borderRadius: '4px',
                padding: '5px',
                fontFamily: 'monospace',
                fontSize: '0.95rem',
              }}
            >
              <div
                style={{
                  boxShadow: 'rgb(0 0 0 / 10%) 0 1px 3px 0',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: val,
                  height: '4rem',
                  marginBottom: '0.5em',
                  borderRadius: '4px',
                }}
              />
              <div>{prop}</div>
              <div>{val}</div>
            </div>
          );
        })}
    </div>
  );
};

import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Settings/Colors',
  component: Colors,
} as ComponentMeta<typeof Colors>;

const Template: ComponentStory<typeof Colors> = () => <Colors />;

export const Default = Template.bind({});
