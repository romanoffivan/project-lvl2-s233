import _ from 'lodash';

const getValueAsStr = (value, prefix = '') =>
  (_.isObject(value) ? 'complex value' : `${prefix}'${value}'`);

const getString = (key, parent, result) => `Property '${parent}${key}' was ${result}`;

const renderers = {
  nested: (node, parentAsPrefix = '', plainRenderer) =>
    `${plainRenderer(node.children, parentAsPrefix.concat(`${node.key}.`))}`,
  added: (node, parentAsPrefix = '') => {
    const value = getValueAsStr(node.value, 'value: ');
    return getString(node.key, parentAsPrefix, `added with ${value}`);
  },
  deleted: (node, parentAsPrefix = '') =>
    getString(node.key, parentAsPrefix, 'removed'),
  changed: (node, parentAsPrefix = '') => {
    const valueBefore = getValueAsStr(node.valueBefore);
    const valueAfter = getValueAsStr(node.valueAfter);
    return getString(node.key, parentAsPrefix, `updated. From ${valueBefore} to ${valueAfter}`);
  },
};

const renderToPlain = (ast, parentAsPrefix) => {
  const filteredAst = ast.filter(node => node.type !== 'unchanged');
  const astAsString = filteredAst.map((node) => {
    const rendererNode = renderers[node.type];
    return rendererNode(node, parentAsPrefix, renderToPlain);
  });
  return astAsString.join('\n');
};

export default renderToPlain;
