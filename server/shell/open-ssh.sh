#!/usr/local/bin/expect

set timeout 10
set username [lindex $argv 0]
set ip   	   [lindex $argv 1]
set password [lindex $argv 2]

spawn ssh-copy-id $username@$ip

expect {
    "(yes/no)?" {
        send "yes\n"
        expect "password:"
        send "$password\n"
    }
    "password:" {
        send "$password\n"
    }
}

interact


