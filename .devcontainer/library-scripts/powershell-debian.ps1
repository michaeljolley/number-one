Install-Module -Name posh-git -Scope AllUsers -Force
Install-Module -Name oh-my-posh -Scope AllUsers -Force
Install-Module -Name devtoolbox -Scope AllUsers -Force

Import-Module posh-git
Add-PoshGitToProfile -AllHosts -AllUsers -Force