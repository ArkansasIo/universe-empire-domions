import readline from 'readline';
import { db } from './db/index';
import { sql } from 'drizzle-orm';

class ServerAdminCLI {
  private rl: readline.Interface;
  private colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
  };

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  private header(title: string) {
    console.clear();
    console.log(this.colors.bright + this.colors.magenta + '╔════════════════════════════════════════════════╗' + this.colors.reset);
    console.log(this.colors.bright + this.colors.magenta + '║' + this.colors.reset + this.colors.bright + `  🛡️  STELLAR DOMINION ADMIN PANEL - ${title}`.padEnd(44) + this.colors.magenta + '║' + this.colors.reset);
    console.log(this.colors.bright + this.colors.magenta + '╚════════════════════════════════════════════════╝' + this.colors.reset + '\n');
  }

  private prompt(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }

  async mainMenu() {
    while (true) {
      this.header('Main Menu');
      console.log(this.colors.bright + 'Select an option:' + this.colors.reset);
      console.log('  1) 📊 Database Browser');
      console.log('  2) 💾 Database Editor');
      console.log('  3) 🔍 SQL Query Executor');
      console.log('  4) ⚙️  Server Settings');
      console.log('  5) 👥 User Management');
      console.log('  0) 🚪 Exit Admin Panel\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      switch (choice.trim()) {
        case '1':
          await this.databaseBrowser();
          break;
        case '2':
          await this.databaseEditor();
          break;
        case '3':
          await this.sqlExecutor();
          break;
        case '4':
          await this.serverSettings();
          break;
        case '5':
          await this.userManagement();
          break;
        case '0':
          console.log(this.colors.green + '\n✓ Admin panel closed. Goodbye!\n' + this.colors.reset);
          this.rl.close();
          process.exit(0);
        default:
          console.log(this.colors.red + '✗ Invalid option. Please try again.' + this.colors.reset);
          await this.prompt(this.colors.dim + 'Press Enter to continue...' + this.colors.reset);
      }
    }
  }

  async databaseBrowser() {
    this.header('Database Browser');
    console.log(this.colors.bright + 'Available Tables:' + this.colors.reset);
    
    const tables = [
      'users', 'player_states', 'missions', 'messages', 'alliances', 
      'battles', 'player_colonies', 'research_areas', 'expeditions'
    ];

    tables.forEach((table, i) => {
      console.log(`  ${i + 1}) ${this.colors.cyan}${table}${this.colors.reset}`);
    });
    console.log('  0) Back to Main Menu\n');

    const choice = await this.prompt(this.colors.cyan + '➜ Select table: ' + this.colors.reset);
    
    if (choice === '0') return;

    const tableIndex = parseInt(choice) - 1;
    if (tableIndex >= 0 && tableIndex < tables.length) {
      const tableName = tables[tableIndex];
      await this.browseTable(tableName);
    }
  }

  async browseTable(tableName: string) {
    this.header(`Browsing Table: ${tableName}`);
    
    try {
      const result = await db.execute(sql.raw(`SELECT * FROM ${tableName} LIMIT 10`));
      
      if (result.rows && result.rows.length > 0) {
        console.log(this.colors.green + `✓ Found ${result.rows.length} rows:` + this.colors.reset + '\n');
        console.log(JSON.stringify(result.rows, null, 2));
      } else {
        console.log(this.colors.yellow + '⚠️  No data in this table.' + this.colors.reset);
      }
    } catch (error: any) {
      console.log(this.colors.red + `✗ Error: ${error.message}` + this.colors.reset);
    }

    await this.prompt(this.colors.dim + '\nPress Enter to continue...' + this.colors.reset);
  }

  async databaseEditor() {
    this.header('Database Editor');
    console.log(this.colors.bright + 'Database Editor Options:' + this.colors.reset);
    console.log('  1) Add New Record');
    console.log('  2) Update Record');
    console.log('  3) Delete Record');
    console.log('  0) Back to Main Menu\n');

    const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

    if (choice === '1') {
      console.log(this.colors.yellow + '\n⚠️  Advanced editor - use SQL Query Executor for safe edits.' + this.colors.reset);
    } else if (choice === '2') {
      console.log(this.colors.yellow + '\n⚠️  Advanced editor - use SQL Query Executor for safe edits.' + this.colors.reset);
    } else if (choice === '3') {
      console.log(this.colors.yellow + '\n⚠️  Advanced editor - use SQL Query Executor for safe edits.' + this.colors.reset);
    }

    await this.prompt(this.colors.dim + '\nPress Enter to continue...' + this.colors.reset);
  }

  async sqlExecutor() {
    this.header('SQL Query Executor');
    console.log(this.colors.yellow + '⚠️  CAUTION: Direct SQL execution. Use with care!' + this.colors.reset + '\n');
    console.log(this.colors.bright + 'Examples:' + this.colors.reset);
    console.log('  • SELECT * FROM users LIMIT 5;');
    console.log('  • SELECT COUNT(*) FROM missions;');
    console.log('  • UPDATE users SET updated_at = NOW() WHERE id = \'...\';\n');

    const query = await this.prompt(this.colors.cyan + '➜ Enter SQL query (or "back"): ' + this.colors.reset);

    if (query.toLowerCase() === 'back') return;

    try {
      const result = await db.execute(sql.raw(query));
      
      console.log(this.colors.green + '\n✓ Query executed successfully!' + this.colors.reset);
      
      if (result.rows) {
        if (result.rows.length > 0) {
          console.log(`\nRows affected/returned: ${result.rows.length}\n`);
          console.log(JSON.stringify(result.rows.slice(0, 5), null, 2));
          if (result.rows.length > 5) {
            console.log(this.colors.dim + `... and ${result.rows.length - 5} more rows` + this.colors.reset);
          }
        } else {
          console.log('\nNo rows returned.');
        }
      }
    } catch (error: any) {
      console.log(this.colors.red + `\n✗ Query Error: ${error.message}` + this.colors.reset);
    }

    await this.prompt(this.colors.dim + '\nPress Enter to continue...' + this.colors.reset);
    await this.sqlExecutor();
  }

  async serverSettings() {
    this.header('Server Settings');
    console.log(this.colors.bright + 'Configuration:' + this.colors.reset);
    console.log(`  Port: ${process.env.PORT || '5000'}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Database Host: ${process.env.PGHOST || 'localhost'}`);
    console.log(`  Database: ${process.env.PGDATABASE || 'postgres'}\n`);

    console.log(this.colors.bright + 'Options:' + this.colors.reset);
    console.log('  1) View All Environment Variables');
    console.log('  2) Database Connection Status');
    console.log('  0) Back to Main Menu\n');

    const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

    if (choice === '1') {
      console.log(this.colors.bright + '\nEnvironment Variables:' + this.colors.reset);
      Object.entries(process.env).forEach(([key, value]) => {
        if (key.includes('PG') || key.includes('NODE') || key.includes('PORT')) {
          console.log(`  ${this.colors.cyan}${key}${this.colors.reset}: ${this.colors.dim}${value}${this.colors.reset}`);
        }
      });
    } else if (choice === '2') {
      try {
        const result = await db.execute(sql`SELECT 1`);
        console.log(this.colors.green + '\n✓ Database connection: ACTIVE' + this.colors.reset);
      } catch (error: any) {
        console.log(this.colors.red + `\n✗ Database connection: FAILED - ${error.message}` + this.colors.reset);
      }
    }

    await this.prompt(this.colors.dim + '\nPress Enter to continue...' + this.colors.reset);
  }

  async userManagement() {
    this.header('User Management');
    console.log(this.colors.bright + 'User Management Options:' + this.colors.reset);
    console.log('  1) List All Users');
    console.log('  2) Find User by Username');
    console.log('  3) View User Details');
    console.log('  4) Reset User Password');
    console.log('  0) Back to Main Menu\n');

    const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

    if (choice === '1') {
      try {
        const result = await db.execute(sql.raw(`SELECT id, username, email, created_at FROM users LIMIT 20`));
        
        console.log(this.colors.green + '\n✓ Users:' + this.colors.reset + '\n');
        if (result.rows && result.rows.length > 0) {
          (result.rows as any[]).forEach(user => {
            console.log(`  ${this.colors.cyan}${user.username}${this.colors.reset} (${user.email})`);
          });
        } else {
          console.log('No users found.');
        }
      } catch (error: any) {
        console.log(this.colors.red + `✗ Error: ${error.message}` + this.colors.reset);
      }
    } else if (choice === '2') {
      const username = await this.prompt(this.colors.cyan + '➜ Enter username: ' + this.colors.reset);
      try {
        const result = await db.execute(sql.raw(`SELECT id, username, email, created_at FROM users WHERE username = '${username}' LIMIT 1`));
        
        if (result.rows && result.rows.length > 0) {
          console.log(this.colors.green + '\n✓ User found:' + this.colors.reset);
          console.log(JSON.stringify(result.rows[0], null, 2));
        } else {
          console.log(this.colors.yellow + '\n⚠️  User not found.' + this.colors.reset);
        }
      } catch (error: any) {
        console.log(this.colors.red + `✗ Error: ${error.message}` + this.colors.reset);
      }
    }

    await this.prompt(this.colors.dim + '\nPress Enter to continue...' + this.colors.reset);
  }

  async start() {
    console.clear();
    console.log(this.colors.bright + this.colors.magenta + '\n  🛡️  STELLAR DOMINION SERVER ADMIN PANEL\n' + this.colors.reset);
    console.log(this.colors.dim + '  Initializing admin console...\n' + this.colors.reset);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.mainMenu();
  }
}

// Start the CLI
const cli = new ServerAdminCLI();
cli.start().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
