// plugins/dashboard.js

import Vue from 'vue';

// Asset imports
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import '~/assets/scss/material-dashboard.scss';

// Library auto imports
import 'es6-promise/auto';

/**
 * This is the main Light Bootstrap Dashboard Vue plugin where dashboard related plugins are registered.
 */
Vue.use(VueMaterial);
