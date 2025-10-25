const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

console.log('🔍 System Diagnostic Tool for Bong Flavours');
console.log('='.repeat(60));

async function systemDiagnostics() {
  console.log('\n📊 SYSTEM INFORMATION');
  console.log('-'.repeat(30));

  // Basic system info
  console.log('Operating System:', os.type(), os.release());
  console.log('Platform:', os.platform());
  console.log('Architecture:', os.arch());
  console.log('CPU Count:', os.cpus().length);
  console.log('Total Memory:', Math.round(os.totalmem() / 1024 / 1024 / 1024), 'GB');
  console.log('Free Memory:', Math.round(os.freemem() / 1024 / 1024 / 1024), 'GB');
  console.log('Node.js Version:', process.version);

  // Check if running on Apple Silicon
  if (os.arch() === 'arm64' && os.platform() === 'darwin') {
    console.log('🍎 Detected: Apple Silicon Mac (M1/M2/M3)');
    console.log('   Note: Some Docker/Chromium processes may need special handling');
  }
}

async function checkProcesses() {
  console.log('\n🔍 PROCESS ANALYSIS');
  console.log('-'.repeat(30));

  return new Promise((resolve) => {
    exec('ps aux | grep -E "(node|chrome|chromium)" | grep -v grep', (error, stdout) => {
      if (stdout) {
        console.log('Running Node/Chrome processes:');
        console.log(stdout);
      } else {
        console.log('No Node/Chrome processes found running');
      }
      resolve();
    });
  });
}

async function checkPorts() {
  console.log('\n🌐 PORT USAGE CHECK');
  console.log('-'.repeat(30));

  const portsToCheck = [3000, 3001, 3002, 8080, 9222];

  for (const port of portsToCheck) {
    try {
      await new Promise((resolve, reject) => {
        exec(`lsof -i :${port}`, (error, stdout) => {
          if (stdout) {
            console.log(`Port ${port}: IN USE`);
            console.log(stdout.split('\n').slice(0, 2).join('\n'));
          } else {
            console.log(`Port ${port}: Available`);
          }
          resolve();
        });
      });
    } catch (error) {
      console.log(`Port ${port}: Check failed`);
    }
  }
}

async function checkDependencies() {
  console.log('\n📦 DEPENDENCY CHECK');
  console.log('-'.repeat(30));

  // Check package.json
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('Project:', pkg.name, pkg.version);
    console.log('Next.js version:', pkg.dependencies?.next || 'Not found');
    console.log('Puppeteer version:', pkg.dependencies?.puppeteer || 'Not found');
    console.log('Nodemailer version:', pkg.dependencies?.nodemailer || 'Not found');
  } catch (error) {
    console.log('❌ Could not read package.json');
  }

  // Check node_modules
  const puppeteerPath = path.join('node_modules', 'puppeteer');
  if (fs.existsSync(puppeteerPath)) {
    console.log('✅ Puppeteer installed');

    // Check for bundled Chromium
    const chromiumPaths = [
      'node_modules/puppeteer/.local-chromium',
      'node_modules/puppeteer-core/.local-chromium',
      'node_modules/@puppeteer/browsers'
    ];

    for (const chromiumPath of chromiumPaths) {
      if (fs.existsSync(chromiumPath)) {
        console.log('✅ Chromium found at:', chromiumPath);
        try {
          const files = fs.readdirSync(chromiumPath);
          console.log('   Contents:', files.slice(0, 3).join(', '));
        } catch (e) {
          console.log('   (Cannot read contents)');
        }
      }
    }
  } else {
    console.log('❌ Puppeteer not found in node_modules');
  }
}

async function checkEnvironment() {
  console.log('\n🔧 ENVIRONMENT CHECK');
  console.log('-'.repeat(30));

  // Load environment variables
  try {
    require('dotenv').config({ path: '.env.local' });

    const envVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'SMTP_HOST',
      'SMTP_USER',
      'SMTP_PASS',
      'NEXT_PUBLIC_SITE_URL'
    ];

    for (const envVar of envVars) {
      const value = process.env[envVar];
      if (value) {
        if (envVar.includes('PASS') || envVar.includes('SECRET')) {
          console.log(`${envVar}: ✅ Set (hidden)`);
        } else {
          console.log(`${envVar}: ✅ ${value.substring(0, 30)}${value.length > 30 ? '...' : ''}`);
        }
      } else {
        console.log(`${envVar}: ❌ Not set`);
      }
    }
  } catch (error) {
    console.log('❌ Could not load environment variables');
  }
}

async function testMemoryUsage() {
  console.log('\n💾 MEMORY USAGE TEST');
  console.log('-'.repeat(30));

  const usage = process.memoryUsage();
  console.log('Current process memory:');
  console.log(`  RSS: ${Math.round(usage.rss / 1024 / 1024)} MB`);
  console.log(`  Heap Total: ${Math.round(usage.heapTotal / 1024 / 1024)} MB`);
  console.log(`  Heap Used: ${Math.round(usage.heapUsed / 1024 / 1024)} MB`);
  console.log(`  External: ${Math.round(usage.external / 1024 / 1024)} MB`);

  // Test memory allocation
  try {
    console.log('\nTesting large memory allocation...');
    const largeArray = new Array(10000000).fill(0);
    console.log('✅ Large memory allocation successful');
    largeArray.length = 0; // Clear memory
  } catch (error) {
    console.log('❌ Large memory allocation failed:', error.message);
  }
}

async function testSimpleSpawn() {
  console.log('\n🚀 PROCESS SPAWN TEST');
  console.log('-'.repeat(30));

  return new Promise((resolve) => {
    console.log('Testing simple process spawn...');

    const child = spawn('node', ['--version'], {
      stdio: 'pipe'
    });

    let output = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code, signal) => {
      if (code === 0) {
        console.log('✅ Process spawn successful:', output.trim());
      } else {
        console.log(`❌ Process spawn failed with code ${code}, signal ${signal}`);
      }
      resolve();
    });

    child.on('error', (error) => {
      console.log('❌ Process spawn error:', error.message);
      resolve();
    });

    // Kill test after 5 seconds
    setTimeout(() => {
      if (!child.killed) {
        console.log('⏰ Killing test process after timeout');
        child.kill('SIGTERM');
        resolve();
      }
    }, 5000);
  });
}

async function checkSecurity() {
  console.log('\n🛡️  SECURITY & PERMISSIONS CHECK');
  console.log('-'.repeat(30));

  // Check if running as root (bad practice)
  if (process.getuid && process.getuid() === 0) {
    console.log('⚠️  WARNING: Running as root user');
  } else {
    console.log('✅ Not running as root');
  }

  // Check file permissions on current directory
  try {
    fs.accessSync('.', fs.constants.R_OK | fs.constants.W_OK);
    console.log('✅ Current directory is readable and writable');
  } catch (error) {
    console.log('❌ Current directory permission issue:', error.message);
  }

  // Check for macOS security restrictions
  if (os.platform() === 'darwin') {
    console.log('🍎 macOS detected - checking common restrictions:');

    // Check if in quarantine
    try {
      await new Promise((resolve) => {
        exec('xattr -l .', (error, stdout) => {
          if (stdout.includes('com.apple.quarantine')) {
            console.log('⚠️  Directory may be in quarantine');
          } else {
            console.log('✅ No quarantine detected');
          }
          resolve();
        });
      });
    } catch (error) {
      console.log('   Could not check quarantine status');
    }
  }
}

async function generateReport() {
  console.log('\n📋 DIAGNOSTIC REPORT');
  console.log('='.repeat(60));

  const report = {
    timestamp: new Date().toISOString(),
    system: {
      os: `${os.type()} ${os.release()}`,
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB',
      freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) + ' GB'
    },
    recommendations: []
  };

  // Add recommendations based on findings
  if (os.arch() === 'arm64' && os.platform() === 'darwin') {
    report.recommendations.push('Use Rosetta 2 for compatibility: arch -x86_64 node server.js');
    report.recommendations.push('Consider using Docker with platform flag: --platform linux/amd64');
  }

  if (Math.round(os.freemem() / 1024 / 1024 / 1024) < 2) {
    report.recommendations.push('Low memory detected - close other applications');
  }

  report.recommendations.push('For PDF issues: Use browser-based PDF generation as fallback');
  report.recommendations.push('For email issues: Configure Mailtrap for development');
  report.recommendations.push('Consider using system Chrome instead of bundled Chromium');

  console.log('\n💡 RECOMMENDATIONS:');
  report.recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });

  // Save report
  fs.writeFileSync('system-diagnostic-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Full report saved to: system-diagnostic-report.json');
}

async function runAllDiagnostics() {
  try {
    await systemDiagnostics();
    await checkProcesses();
    await checkPorts();
    await checkDependencies();
    await checkEnvironment();
    await testMemoryUsage();
    await testSimpleSpawn();
    await checkSecurity();
    await generateReport();

    console.log('\n🎉 Diagnostic completed successfully!');

  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error);
  }
}

// Run diagnostics
runAllDiagnostics();
