#!/bin/bash

tag_number=$1

if [ $tag_number ]
then
  echo "start pre-release with $tag_number"
  echo $tag_number

  npm version $tag_number --no-git-tag-version
  git tag -a $tag_number -m "$tag_number"

  echo 'done -> remember to push the tag :)'
else
  echo 'we need a tag number'
fi


