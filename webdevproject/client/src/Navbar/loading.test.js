import React from 'react';
import renderer from 'react-test-renderer';
import LoadingIcon from './LoadingIcon';

test('renders LoadingIcon component', () => {
  const tree = renderer.create(<LoadingIcon />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders LoadingIcon component with custom size', () => {
  const tree = renderer.create(<LoadingIcon size={40} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders LoadingIcon component with different color', () => {
  const tree = renderer.create(<LoadingIcon color="red" />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders LoadingIcon component in loading state', () => {
  const tree = renderer.create(<LoadingIcon isLoading />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('LoadingIcon component is accessible', async () => {
  const tree = renderer.create(<LoadingIcon />).toJSON();
  expect(tree).toMatchSnapshot();

});

test('renders spinner variant of LoadingIcon component', () => {
  const tree = renderer.create(<LoadingIcon variant="spinner" />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders bar variant of LoadingIcon component', () => {
  const tree = renderer.create(<LoadingIcon variant="bar" />).toJSON();
  expect(tree).toMatchSnapshot();
});
