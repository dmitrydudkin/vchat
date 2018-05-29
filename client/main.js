import { KeepAwake, registerRootComponent } from 'expo';
import App from './src/App';

if (__DEV__) { // eslint-disable-line
  KeepAwake.activate();
}

registerRootComponent(App);
