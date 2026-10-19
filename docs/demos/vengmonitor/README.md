# VengMonitor Demo Edition

Public **standalone fictional simulator**, developed separately from the private production application. No production source code, equipment commands, customer data, site settings, company logos, credentials or Telegram requests.

Simulates three fictional rooms, SERV alarms, raised/cleared transitions, Mirror heartbeat loss, and a local (fake) delivery log. 5 seconds in the demonstration stands in for a nominal 300-second connection wait; production timeouts and algorithms are not implemented here.

The demo contains only HTML/CSS/JS and synthetic data. It does not access real industrial equipment, use a backend or send network requests beyond loading its own static files. All state is ephemeral and resets on refresh.