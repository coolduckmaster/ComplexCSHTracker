import os
from pathlib import Path
from pick import pick
from datetime import datetime

rootfolder = Path(__file__).resolve().parent
ignorefolder = {'node_modules'}
findfilesext = {'.js', '.jsx'}
filepath = "Changelogs.md"
current = datetime.now()
format = current.strftime("%m/%d/%y")
dateheader = f"\n---- \n({format})\n"


jsjsxfile = sorted(list(set([
    file.stem for file in rootfolder.rglob('*')
    if file.is_file() 
    and file.suffix in findfilesext 
    and not any(ignored in file.parts for ignored in ignorefolder)
])))

if not jsjsxfile:
    print("No .js or .jsx files found!")
    exit()

PAGE_SIZE = 5
current_page = 0
total_pages = (len(jsjsxfile) + PAGE_SIZE - 1) // PAGE_SIZE

ascii_art = r"""
  _____                __          ___________ __  ______             __          
 / ___/__  __ _  ___  / /____ __  / ___/ __/ // / /_  __/______ _____/ /_____ ____
/ /__/ _ \/  ' \/ _ \/ / -_) \ / / /___\ \/ _  /   / / / __/ _ `/ __/  '_/ -_) __/
\___/\___/_/_/_/ .__/_/\__/_\_\  \___/___/_//_/   /_/ /_/  \_,_/\__/_/\_\\__/_/   
              /_/                                                                 
"""


print(ascii_art)
print("Changelogs helper")

def preseteditor():
  global current_page 
  frontbackend = input("Frontend or Backend?(1-2): ").strip() 
  addorfixoredit = input("Add/Fix/Edit?(1-3): ").strip()

  chosen_file = None

  if frontbackend == "1":
        frontbackend = "Frontend"
  elif frontbackend == "2":
        frontbackend = "Backend API"
  else:
        print("Error")
        return

  if addorfixoredit == "1":
        addorfixoredit = ""
  elif addorfixoredit == "2":
        addorfixoredit = "fixes for" 
  elif addorfixoredit == "3":
        addorfixoredit = "edits"
  else:
        print("Error")
        return  

  if addorfixoredit == "edits":
        editfororto = input("For/To?(1-2): ").lower()
        if editfororto == "1":
            editfororto = "for"
        elif editfororto == "2":
            editfororto = "to"
        
        addorfixoredit = f"edits {editfororto}"

  while True:
    start_idx = current_page * PAGE_SIZE
    end_idx = start_idx + PAGE_SIZE
    page_items = jsjsxfile[start_idx:end_idx]
    
    options = list(page_items)
    if current_page < total_pages - 1:
        options.append("[Next Page]")
    if current_page > 0:
        options.append("[Previous Page]")
        
    title = f"What file? (Page {current_page + 1}/{total_pages}): "
    option, index = pick(options, title, indicator='=>', default_index=0)
    
    if option == "[Next Page]":
        current_page += 1
    elif option == "[Previous Page]":
        current_page -= 1
    else:
        print(f"select file: {option}")
        chosen_file = option
        break

  changelogstring = f'{frontbackend} {addorfixoredit} "{chosen_file}"'  

  while True:
    subnote = input("Add a subnote?(Leave empty to skip): ").strip()
    if subnote:
        changelogstring += f"\n  - {subnote}"
    else:
        break
  
  if os.path.exists(filepath):
    with open(filepath, "r") as file:
        filecontent = file.read()

  with open(filepath, "a") as file:
        if f"({format})" not in filecontent:
            file.write(dateheader)
        file.write(f"+ {changelogstring}\n")
        print(f"+ {changelogstring}")

  newcheck()

def customeditor():
  customstring = input("Input a custom string: ").strip()
  while True:
    customsubnote = input("Add custom subnote?: ").strip()
    if customsubnote:
        customstring += f"\n  - {customsubnote}"
    else:
        break  
  
  if os.path.exists(filepath):
      with open(filepath, "r") as file:
          filecontent = file.read()
  with open(filepath, "a") as file:
        if f"({format})" not in filecontent:
            file.write(dateheader)
        file.write(f"+ {customstring}\n")
        print(f"+ {customstring}")
    


def newcheck():
    newstring = input("New string?(y/n/c): ").lower()
    if newstring == "y":
        preseteditor()
        newstring = ""
    elif newstring == "c":
        customeditor()
        newstring = ""
    else:
        exit()

newcheck()

