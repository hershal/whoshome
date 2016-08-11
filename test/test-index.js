const assert = require('chai').assert;

const parser = require('../parser');

const typicalReturn =
`{lan_mac::E4:F4:C6:0B:E7:C4}
{wan_mac::E4:F4:C6:0B:E7:C6}
{wl_mac::E4:F4:C6:0B:E7:C7}
{lan_ip::10.0.0.1}
{wl_channel::1}
{wl_radio::Radio is On}
{wl_xmit::Auto}
{wl_rate::216.5 Mbps}
{packet_info::SWRXgoodPacket=992046;SWRXerrorPacket=10;SWTXgoodPacket=2134533;SWTXerrorPacket=20;}
{wl_mode_short::ap}
{lan_proto::dhcp}
{mem_info::,'total:','used:','free:','shared:','buffers:','cached:','Mem:','262025216','38461440','223563776','0','3874816','10444800','Swap:','0','0','0','MemTotal:','255884','kB','MemFree:','218324','kB','MemShared:','0','kB','Buffers:','3784','kB','Cached:','10200','kB','SwapCached:','0','kB','Active:','6816','kB','Inactive:','9620','kB','Active(anon):','2452','kB','Inactive(anon):','0','kB','Active(file):','4364','kB','Inactive(file):','9620','kB','Unevictable:','0','kB','Mlocked:','0','kB','HighTotal:','131072','kB','HighFree:','118172','kB','LowTotal:','124812','kB','LowFree:','100152','kB','SwapTotal:','0','kB','SwapFree:','0','kB','Dirty:','0','kB','Writeback:','0','kB','AnonPages:','2416','kB','Mapped:','1276','kB','Shmem:','0','kB','Slab:','7316','kB','SReclaimable:','1408','kB','SUnreclaim:','5908','kB','KernelStack:','344','kB','PageTables:','228','kB','NFS_Unstable:','0','kB','Bounce:','0','kB','WritebackTmp:','0','kB','CommitLimit:','127940','kB','Committed_AS:','5324','kB','VmallocTotal:','892928','kB','VmallocUsed:','33168','kB','VmallocChunk:','623612','kB'}
{active_wireless::'xx:xx:xx:xx:70:65','eth1','0:16:17','216M','216M','-44','-90','46','614','xx:xx:xx:xx:41:A9','eth1','2:07:01','1M','24M','-55','-90','35','478','xx:xx:xx:xx:CD:F9','eth1','2:58:36','72M','39M','-48','-90','42','564','xx:xx:xx:xx:17:31','eth1','3:42:46','144M','130M','-60','-90','30','416','xx:xx:xx:xx:7A:8B','eth1','8:07:40','72M','6M','-53','-90','37','502','xx:xx:xx:xx:23:8E','eth1','10:20:59','144M','24M','-40','-90','50','664','xx:xx:xx:xx:35:19','eth1','12:17:44','144M','117M','-48','-90','42','564'}
{active_wds::}
{dhcp_leases:: 'flux','10.0.0.126','xx:xx:xx:xx:37:E9','1 day 00:00:00','126','*','10.0.0.102','xx:xx:xx:xx:CD:F9','1 day 00:00:00','102','Bendphone','10.0.0.128','xx:xx:xx:xx:23:8E','1 day 00:00:00','128','Hershals-iPad','10.0.0.148','xx:xx:xx:xx:94:D8','1 day 00:00:00','148','KetraBaksiPhone','10.0.0.111','xx:xx:xx:xx:42:C1','1 day 00:00:00','111','android-dea031f9cde4331f','10.0.0.101','xx:xx:xx:xx:41:A9','1 day 00:00:00','101','Erics-iPhone','10.0.0.114','xx:xx:xx:xx:90:EB','1 day 00:00:00','114','silver','10.0.0.135','xx:xx:xx:xx:70:65','1 day 00:00:00','135','Chromecast','10.0.0.115','xx:xx:xx:xx:7A:8B','1 day 00:00:00','115','kindle-8d2d16505','10.0.0.116','xx:xx:xx:xx:35:19','1 day 00:00:00','116','android-6c6e622e3fcf7e0','10.0.0.120','xx:xx:xx:xx:17:31','1 day 00:00:00','120','android-a3aa6f56d0dcde64','10.0.0.130','xx:xx:xx:xx:5F:50','1 day 00:00:00','130','horus','10.0.0.141','xx:xx:xx:xx:89:18','1 day 00:00:00','141'}
{uptime:: 19:43:08 up 12:22,  load average: 0.10, 0.08, 0.05}
{ipinfo::&nbsp;IP: 10.0.1.2}
{wan_ipaddr::10.0.1.2}
{gps_text::}
{gps_lat::}
{gps_lon::}
{gps_alt::}
{gps_sat::}
{gps_latdec::}
{gps_londec::}
{gps_link::}
{nvram::38.40 KB / 64 KB}`;

describe('basic test', function () {
  it('should parse a typical return', function () {
    parser.parse(typicalReturn);
  });
});

describe('client data structure test', function () {
  it('should parse a dhcp client string', function () {
    const client = new parser.dhcp(['Bendphone','10.0.0.128','xx:xx:xx:xx:23:8E','1 day 00:00:00','128']);
    assert(client.hostname === 'Bendphone', 'could not parse hostname');
    assert(client.ip === '10.0.0.128', 'could not parse ip');
    assert(client.mac === 'xx:xx:xx:xx:23:8E', 'could not parse mac');
  });

  it('should parse a wifi client string', function () {
    const client = new parser.wifi(['xx:xx:xx:xx:23:8E', 'eth2', '5:47:52', '6M', '24M', '-74', '-92', '18', '242']);
    assert(client.mac === 'xx:xx:xx:xx:23:8E', 'could not parse mac');
    assert(client.uptime === '5:47:52', 'could not parse uptime');
    assert(client.signal === '-74', 'could not parse signal');
    assert(client.snr === '18', 'could not parse snr');
  });
});
