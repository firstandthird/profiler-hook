'use strict';
const fs = require('fs');

class ProfileHook {
  constructor(log) {
    this.running = false;
    this.profiler = false;
    this.logger = log;

    process.on('SIGUSR2', this.toggle.bind(this));
  }

  log(msg) {
    if (this.logger) {
      return this.logger(msg);
    }
    console.log(msg); //eslint-disable-line no-console
  }

  toggle() {
    if (!this.profiler) {
      this.profiler = require('v8-profiler');
    }
    if (this.running) {
      const profile = this.profiler.stopProfiling();
      this.log('stopped profiling');
      const file = `./profile-${Date.now()}.cpuprofile`;
      profile.export()
        .pipe(fs.createWriteStream(file))
        .once('error', this.profiler.deleteAllProfiles)
        .once('finish', () => {
          this.profiler.deleteAllProfiles();
          this.log(`wrote profile to file: ${file}`);
        });
      this.running = false;
      return;
    }
    this.log('starting profiling');
    this.profiler.startProfiling();
    this.running = true;
  }
}

module.exports = ProfileHook;
